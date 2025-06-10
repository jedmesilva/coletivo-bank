import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireAuth } from './middleware/auth';

// Import controllers
import { getUserProfile, createAsaasAccount, updateProfile } from './controllers/authController';
import { 
  createFund, 
  getUserFunds, 
  getFundDetails, 
  depositToFund, 
  requestCapital, 
  approveCapitalRequest 
} from './controllers/fundsController';
import { 
  getUserDebts, 
  getFundDebts, 
  payDebt, 
  getDebtDetails 
} from './controllers/debtsController';

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com'] 
      : ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  });
  app.use('/api/', limiter);

  // Authentication middleware for all API routes
  app.use('/api', authenticateToken);

  // ===== AUTH ROUTES =====
  app.get('/api/auth/profile', requireAuth, getUserProfile);
  app.post('/api/auth/asaas-account', requireAuth, createAsaasAccount);
  app.put('/api/auth/profile', requireAuth, updateProfile);

  // ===== FUNDS ROUTES =====
  app.post('/api/funds', requireAuth, createFund);
  app.get('/api/funds', requireAuth, getUserFunds);
  app.get('/api/funds/:fundId', requireAuth, getFundDetails);
  app.post('/api/funds/:fundId/deposit', requireAuth, depositToFund);
  app.post('/api/funds/:fundId/request-capital', requireAuth, requestCapital);
  app.put('/api/approvals/:approvalId', requireAuth, approveCapitalRequest);

  // ===== DEBTS ROUTES =====
  app.get('/api/debts', requireAuth, getUserDebts);
  app.get('/api/funds/:fundId/debts', requireAuth, getFundDebts);
  app.get('/api/debts/:debtId', requireAuth, getDebtDetails);
  app.post('/api/debts/:debtId/pay', requireAuth, payDebt);

  // ===== TRANSACTIONS ROUTES =====
  app.get('/api/funds/:fundId/transactions', requireAuth, async (req, res) => {
    try {
      const { fundId } = req.params;
      // Implementation for getting fund transactions
      res.json({ success: true, message: 'Transações do fundo', data: [] });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get('/api/transactions', requireAuth, async (req, res) => {
    try {
      // Implementation for getting user transactions
      res.json({ success: true, message: 'Transações do usuário', data: [] });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ===== ASAAS WEBHOOK =====
  app.post('/api/webhook/asaas', async (req, res) => {
    try {
      // Handle Asaas webhooks for payment status updates
      const { event, payment } = req.body;
      
      // Process webhook based on event type
      console.log('Asaas webhook received:', event, payment);
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Erro ao processar webhook Asaas:', error);
      res.status(500).json({ error: 'Erro ao processar webhook' });
    }
  });

  // ===== HEALTH CHECK =====
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      message: 'Backend funcionando corretamente'
    });
  });

  // Error handling middleware
  app.use('/api', (err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
