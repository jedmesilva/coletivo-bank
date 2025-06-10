import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { asaasService } from '../services/asaas';

export interface ReplitAuthUser {
  sub: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  iat?: number;
  exp?: number;
}

export const validateReplitToken = async (token: string): Promise<ReplitAuthUser | null> => {
  try {
    // In production, you should verify the token signature
    // For now, we'll decode without verification for development
    const decoded = jwt.decode(token) as ReplitAuthUser;
    
    if (!decoded || !decoded.sub) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Erro ao validar token Replit:', error);
    return null;
  }
};

export const createOrUpdateUser = async (replitUser: ReplitAuthUser) => {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, replitUser.sub))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      const updatedUser = await db
        .update(users)
        .set({
          email: replitUser.email,
          firstName: replitUser.first_name,
          lastName: replitUser.last_name,
          profileImageUrl: replitUser.profile_image_url,
          updatedAt: new Date(),
        })
        .where(eq(users.id, replitUser.sub))
        .returning();

      return updatedUser[0];
    } else {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          id: replitUser.sub,
          email: replitUser.email,
          firstName: replitUser.first_name,
          lastName: replitUser.last_name,
          profileImageUrl: replitUser.profile_image_url,
          accountLevel: 'bronze',
        })
        .returning();

      // Optionally create Asaas customer account immediately
      try {
        if (newUser[0].email) {
          const asaasCustomer = await asaasService.createCustomer({
            name: `${newUser[0].firstName || ''} ${newUser[0].lastName || ''}`.trim() || newUser[0].email,
            email: newUser[0].email,
          });

          // Update user with Asaas customer ID
          await db
            .update(users)
            .set({ 
              asaasCustomerId: asaasCustomer.id,
              updatedAt: new Date(),
            })
            .where(eq(users.id, newUser[0].id));

          newUser[0].asaasCustomerId = asaasCustomer.id;
        }
      } catch (asaasError) {
        console.warn('Aviso: Não foi possível criar conta Asaas automaticamente:', asaasError);
        // Continue without Asaas account - user can create it later
      }

      return newUser[0];
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário:', error);
    throw error;
  }
};