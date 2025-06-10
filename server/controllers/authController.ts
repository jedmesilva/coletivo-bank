import { Request, Response } from 'express';
import { db } from '../config/database';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { asaasService } from '../services/asaas';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      data: {
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        profileImageUrl: user[0].profileImageUrl,
        accountLevel: user[0].accountLevel,
        hasAsaasAccount: !!user[0].asaasCustomerId,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createAsaasAccount = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Check if user already has Asaas account
    if (user[0].asaasCustomerId) {
      return res.status(400).json({ error: 'Usuário já possui conta no Asaas' });
    }

    const { cpfCnpj, phone } = req.body;

    // Create customer in Asaas
    const asaasCustomer = await asaasService.createCustomer({
      name: `${user[0].firstName || ''} ${user[0].lastName || ''}`.trim() || user[0].email || 'Usuário',
      email: user[0].email || '',
      cpfCnpj,
      phone,
    });

    // Update user with Asaas customer ID
    await db
      .update(users)
      .set({ 
        asaasCustomerId: asaasCustomer.id,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id));

    res.json({
      success: true,
      message: 'Conta Asaas criada com sucesso',
      data: {
        asaasCustomerId: asaasCustomer.id,
      }
    });
  } catch (error) {
    console.error('Erro ao criar conta Asaas:', error);
    res.status(500).json({ error: 'Erro ao criar conta no sistema de pagamentos' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { firstName, lastName, profileImageUrl } = req.body;

    await db
      .update(users)
      .set({
        firstName,
        lastName,
        profileImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user.id));

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};