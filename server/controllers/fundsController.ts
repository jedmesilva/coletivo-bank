import { Request, Response } from 'express';
import { db } from '../config/database';
import { funds, fundMembers, transactions, approvals, debts } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';

export const createFund = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { name, description, image, memberEmails } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome do fundo é obrigatório' });
    }

    // Create fund
    const newFund = await db
      .insert(funds)
      .values({
        name,
        description,
        image,
        balance: '0.00',
        growth: '0.00',
      })
      .returning();

    const fundId = newFund[0].id;

    // Add creator as admin
    await db
      .insert(fundMembers)
      .values({
        fundId,
        userId: req.user.id,
        role: 'admin',
      });

    // Add other members if provided
    if (memberEmails && memberEmails.length > 0) {
      // Note: In a real implementation, you'd validate emails and create users if needed
      // For now, we'll just add the creator as admin
    }

    res.json({
      success: true,
      message: 'Fundo criado com sucesso',
      data: {
        id: fundId,
        name,
        description,
        image,
        balance: '0.00',
        growth: '0.00',
        createdAt: newFund[0].createdAt,
      }
    });
  } catch (error) {
    console.error('Erro ao criar fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getUserFunds = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userFunds = await db
      .select({
        id: funds.id,
        name: funds.name,
        description: funds.description,
        image: funds.image,
        balance: funds.balance,
        growth: funds.growth,
        createdAt: funds.createdAt,
        role: fundMembers.role,
      })
      .from(funds)
      .innerJoin(fundMembers, eq(funds.id, fundMembers.fundId))
      .where(eq(fundMembers.userId, req.user.id))
      .orderBy(desc(funds.createdAt));

    res.json({
      success: true,
      data: userFunds
    });
  } catch (error) {
    console.error('Erro ao buscar fundos do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getFundDetails = async (req: Request, res: Response) => {
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

    // Get fund details
    const fundDetails = await db
      .select()
      .from(funds)
      .where(eq(funds.id, fundId))
      .limit(1);

    if (!fundDetails.length) {
      return res.status(404).json({ error: 'Fundo não encontrado' });
    }

    // Get fund members
    const members = await db
      .select({
        userId: fundMembers.userId,
        role: fundMembers.role,
        joinedAt: fundMembers.joinedAt,
      })
      .from(fundMembers)
      .where(eq(fundMembers.fundId, fundId));

    // Get fund transactions
    const fundTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.fundId, fundId))
      .orderBy(desc(transactions.createdAt));

    // Get fund approvals
    const fundApprovals = await db
      .select()
      .from(approvals)
      .where(eq(approvals.fundId, fundId))
      .orderBy(desc(approvals.createdAt));

    // Get fund debts
    const fundDebts = await db
      .select()
      .from(debts)
      .where(eq(debts.fundId, fundId))
      .orderBy(desc(debts.createdAt));

    res.json({
      success: true,
      data: {
        fund: fundDetails[0],
        members,
        transactions: fundTransactions,
        approvals: fundApprovals,
        debts: fundDebts,
        userRole: membership[0].role,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const depositToFund = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { fundId } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

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

    // Create transaction record
    const newTransaction = await db
      .insert(transactions)
      .values({
        fundId,
        userId: req.user.id,
        type: 'deposit',
        amount: amount.toString(),
        description,
        status: 'completed', // In real app, this would be 'pending' until payment confirmation
      })
      .returning();

    // Get current fund balance
    const currentFund = await db
      .select()
      .from(funds)
      .where(eq(funds.id, fundId))
      .limit(1);

    const currentBalance = parseFloat(currentFund[0].balance || '0');
    
    // Update fund balance
    await db
      .update(funds)
      .set({
        balance: (currentBalance + amount).toString(),
        updatedAt: new Date(),
      })
      .where(eq(funds.id, fundId));

    res.json({
      success: true,
      message: 'Depósito realizado com sucesso',
      data: newTransaction[0]
    });
  } catch (error) {
    console.error('Erro ao realizar depósito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const requestCapital = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { fundId } = req.params;
    const { amount, description, dueDate } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

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

    // Create approval request
    const newApproval = await db
      .insert(approvals)
      .values({
        fundId,
        requesterId: req.user.id,
        amount: amount.toString(),
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: 'pending',
      })
      .returning();

    res.json({
      success: true,
      message: 'Solicitação de capital enviada para aprovação',
      data: newApproval[0]
    });
  } catch (error) {
    console.error('Erro ao solicitar capital:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const approveCapitalRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { approvalId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    // Get approval details
    const approval = await db
      .select()
      .from(approvals)
      .where(eq(approvals.id, approvalId))
      .limit(1);

    if (!approval.length) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    // Check if user is admin of the fund
    const membership = await db
      .select()
      .from(fundMembers)
      .where(and(
        eq(fundMembers.fundId, approval[0].fundId),
        eq(fundMembers.userId, req.user.id),
        eq(fundMembers.role, 'admin')
      ))
      .limit(1);

    if (!membership.length) {
      return res.status(403).json({ error: 'Apenas administradores podem aprovar solicitações' });
    }

    // Update approval status
    await db
      .update(approvals)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(approvals.id, approvalId));

    // If approved, create debt and update fund balance
    if (status === 'approved') {
      const amount = parseFloat(approval[0].amount || '0');
      
      // Create debt record
      await db
        .insert(debts)
        .values({
          fundId: approval[0].fundId,
          userId: approval[0].requesterId,
          amount: amount.toString(),
          originalAmount: amount.toString(),
          description: approval[0].description,
          dueDate: approval[0].dueDate,
          status: 'active',
        });

      // Update fund balance (subtract the amount)
      await db
        .update(funds)
        .set({
          balance: (parseFloat(funds.balance) - amount).toString(),
          updatedAt: new Date(),
        })
        .where(eq(funds.id, approval[0].fundId));

      // Create transaction record
      await db
        .insert(transactions)
        .values({
          fundId: approval[0].fundId,
          userId: approval[0].requesterId,
          type: 'withdrawal',
          amount: amount.toString(),
          description: `Capital aprovado: ${approval[0].description}`,
          status: 'completed',
        });
    }

    res.json({
      success: true,
      message: `Solicitação ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
    });
  } catch (error) {
    console.error('Erro ao processar aprovação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};