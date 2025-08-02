import { Request, Response } from 'express';
import { db } from '../config/database';
import { debts, funds, fundMembers, transactions } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';

export const getUserDebts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userDebts = await db
      .select({
        id: debts.id,
        fundId: debts.fundId,
        fundName: funds.name,
        amount: debts.amount,
        originalAmount: debts.originalAmount,
        description: debts.description,
        dueDate: debts.dueDate,
        status: debts.status,
        createdAt: debts.createdAt,
      })
      .from(debts)
      .innerJoin(funds, eq(debts.fundId, funds.id))
      .where(eq(debts.userId, req.user.id))
      .orderBy(desc(debts.createdAt));

    res.json({
      success: true,
      data: userDebts
    });
  } catch (error) {
    console.error('Erro ao buscar dívidas do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getFundDebts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { fundId } = req.params;

    // Check if user is member of the fund
    const membership = await db
      .select()
      .from(fundMembers)
      .where(and(
        eq(fundMembers.fundId, fundId),
        eq(fundMembers.userId, req.user.id)
      ))
      .limit(1);

    if (!membership.length) {
      return res.status(403).json({ error: 'Acesso negado ao fundo' });
    }

    const fundDebts = await db
      .select()
      .from(debts)
      .where(eq(debts.fundId, fundId))
      .orderBy(desc(debts.createdAt));

    res.json({
      success: true,
      data: fundDebts
    });
  } catch (error) {
    console.error('Erro ao buscar dívidas do fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const payDebt = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { debtId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    // Get debt details
    const debt = await db
      .select()
      .from(debts)
      .where(eq(debts.id, debtId))
      .limit(1);

    if (!debt.length) {
      return res.status(404).json({ error: 'Dívida não encontrada' });
    }

    // Check if user owns this debt
    if (debt[0].userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado a esta dívida' });
    }

    const currentDebtAmount = parseFloat(debt[0].amount);
    const paymentAmount = parseFloat(amount.toString());

    if (paymentAmount > currentDebtAmount) {
      return res.status(400).json({ error: 'Valor do pagamento não pode ser maior que o valor da dívida' });
    }

    const remainingAmount = currentDebtAmount - paymentAmount;

    // Update debt amount
    await db
      .update(debts)
      .set({
        amount: remainingAmount.toString(),
        status: remainingAmount <= 0 ? 'paid' : 'active',
        updatedAt: new Date(),
      })
      .where(eq(debts.id, debtId));

    // Get current fund balance and update it
    const currentFund = await db
      .select()
      .from(funds)
      .where(eq(funds.id, debt[0].fundId))
      .limit(1);

    const currentBalance = parseFloat(currentFund[0].balance || '0');

    // Update fund balance (add the payment)
    await db
      .update(funds)
      .set({
        balance: (currentBalance + paymentAmount).toString(),
        updatedAt: new Date(),
      })
      .where(eq(funds.id, debt[0].fundId));

    // Create transaction record
    await db
      .insert(transactions)
      .values({
        fundId: debt[0].fundId,
        userId: req.user.id,
        type: 'debt-payment',
        amount: paymentAmount.toString(),
        description: `Pagamento de dívida: ${debt[0].description}`,
        status: 'completed',
      });

    res.json({
      success: true,
      message: remainingAmount <= 0 ? 'Dívida quitada com sucesso' : 'Pagamento realizado com sucesso',
      data: {
        remainingAmount: remainingAmount.toString(),
        status: remainingAmount <= 0 ? 'paid' : 'active',
      }
    });
  } catch (error) {
    console.error('Erro ao pagar dívida:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getDebtDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { debtId } = req.params;

    const debtDetails = await db
      .select({
        id: debts.id,
        fundId: debts.fundId,
        fundName: funds.name,
        amount: debts.amount,
        originalAmount: debts.originalAmount,
        description: debts.description,
        dueDate: debts.dueDate,
        status: debts.status,
        createdAt: debts.createdAt,
      })
      .from(debts)
      .innerJoin(funds, eq(debts.fundId, funds.id))
      .where(eq(debts.id, debtId))
      .limit(1);

    if (!debtDetails.length) {
      return res.status(404).json({ error: 'Dívida não encontrada' });
    }

    // Check if user owns this debt or is admin of the fund
    const debt = debtDetails[0];
    const hasAccess = debt.userId === req.user.id || 
      await db
        .select()
        .from(fundMembers)
        .where(and(
          eq(fundMembers.fundId, debt.fundId),
          eq(fundMembers.userId, req.user.id),
          eq(fundMembers.role, 'admin')
        ))
        .limit(1);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Acesso negado a esta dívida' });
    }

    // Get payment history for this debt
    const paymentHistory = await db
      .select()
      .from(transactions)
      .where(and(
        eq(transactions.fundId, debt.fundId),
        eq(transactions.userId, debt.userId),
        eq(transactions.type, 'debt-payment')
      ))
      .orderBy(desc(transactions.createdAt));

    res.json({
      success: true,
      data: {
        debt: debtDetails[0],
        paymentHistory,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes da dívida:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};