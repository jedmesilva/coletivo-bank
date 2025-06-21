import { Request, Response } from 'express';
import { db } from '../config/database';
import { funds } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export const updateFundSettings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { fundId } = req.params;
    const { contributionRate, interestRate, approvalType, minimumQuorum } = req.body;

    // Validações
    if (contributionRate < 0 || contributionRate > 1000) {
      return res.status(400).json({ 
        error: 'A taxa de contribuição deve estar entre 0% e 1.000%' 
      });
    }

    if (interestRate < 0 || interestRate > 12) {
      return res.status(400).json({ 
        error: 'A taxa de juros deve estar entre 0% e 12% ao ano' 
      });
    }

    if (!['quorum', 'unanimous'].includes(approvalType)) {
      return res.status(400).json({ 
        error: 'Tipo de aprovação inválido' 
      });
    }

    if (approvalType === 'quorum' && (minimumQuorum < 1 || minimumQuorum > 100)) {
      return res.status(400).json({ 
        error: 'O quórum mínimo deve estar entre 1% e 100%' 
      });
    }

    // Verificar se o usuário tem permissão para editar o fundo (deve ser admin)
    const fundMember = await db.query.fundMembers.findFirst({
      where: (fundMembers, { and, eq }) => and(
        eq(fundMembers.fundId, fundId),
        eq(fundMembers.userId, req.user!.id)
      )
    });

    if (!fundMember || fundMember.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Você não tem permissão para editar as configurações deste fundo' 
      });
    }

    // Atualizar as configurações do fundo
    const updatedFund = await db
      .update(funds)
      .set({
        contributionRate: contributionRate.toString(),
        interestRate: interestRate.toString(),
        approvalType,
        minimumQuorum,
        updatedAt: new Date()
      })
      .where(eq(funds.id, fundId))
      .returning();

    if (updatedFund.length === 0) {
      return res.status(404).json({ error: 'Fundo não encontrado' });
    }

    res.json({
      success: true,
      message: 'Configurações do fundo atualizadas com sucesso',
      data: {
        id: updatedFund[0].id,
        contributionRate: parseFloat(updatedFund[0].contributionRate || '100'),
        interestRate: parseFloat(updatedFund[0].interestRate || '0'),
        approvalType: updatedFund[0].approvalType,
        minimumQuorum: updatedFund[0].minimumQuorum
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar configurações do fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getFundSettings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { fundId } = req.params;

    // Verificar se o usuário é membro do fundo
    const fundMember = await db.query.fundMembers.findFirst({
      where: (fundMembers, { and, eq }) => and(
        eq(fundMembers.fundId, fundId),
        eq(fundMembers.userId, req.user!.id)
      )
    });

    if (!fundMember) {
      return res.status(403).json({ 
        error: 'Você não tem acesso a este fundo' 
      });
    }

    // Buscar as configurações do fundo
    const fund = await db.query.funds.findFirst({
      where: (funds, { eq }) => eq(funds.id, fundId),
      columns: {
        id: true,
        name: true,
        description: true,
        contributionRate: true,
        interestRate: true,
        approvalType: true,
        minimumQuorum: true
      }
    });

    if (!fund) {
      return res.status(404).json({ error: 'Fundo não encontrado' });
    }

    res.json({
      success: true,
      data: {
        id: fund.id,
        name: fund.name,
        description: fund.description || '',
        contributionRate: parseFloat(fund.contributionRate || '100'),
        interestRate: parseFloat(fund.interestRate || '0'),
        approvalType: fund.approvalType || 'quorum',
        minimumQuorum: fund.minimumQuorum || 50
      }
    });

  } catch (error) {
    console.error('Erro ao buscar configurações do fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};