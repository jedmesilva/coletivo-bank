import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        profileImageUrl?: string;
        accountLevel: string;
      };
    }
  }
}

export interface ReplitUser {
  sub: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    // Decode the JWT token from Replit Auth
    const decoded = jwt.decode(token) as ReplitUser;
    
    if (!decoded || !decoded.sub) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Check if user exists in database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.sub))
      .limit(1);

    let user;
    if (existingUser.length === 0) {
      // Create new user if doesn't exist
      const newUser = await db
        .insert(users)
        .values({
          id: decoded.sub,
          email: decoded.email,
          firstName: decoded.first_name,
          lastName: decoded.last_name,
          profileImageUrl: decoded.profile_image_url,
          accountLevel: 'bronze',
        })
        .returning();
      
      user = newUser[0];
    } else {
      user = existingUser[0];
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      accountLevel: user.accountLevel || 'bronze',
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  next();
};