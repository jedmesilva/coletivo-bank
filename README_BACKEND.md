# Backend Dedicado - Sistema de Fundos Colaborativos

## Visão Geral
Backend completo desenvolvido para a aplicação de fundos colaborativos, com integração total com Asaas (pagamentos) e Supabase (banco de dados). O sistema oferece APIs REST completas para autenticação, gestão de fundos, transações e controle de dívidas.

## Arquitetura

### Stack Tecnológica
- **Framework**: Express.js + TypeScript
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: Replit Auth
- **Pagamentos**: Asaas API
- **Segurança**: Helmet, CORS, Rate Limiting
- **Validação**: Zod schemas

### Estrutura de Pastas
```
server/
├── auth/          # Configuração autenticação Replit
├── config/        # Configuração banco de dados
├── controllers/   # Lógica de negócio das APIs
├── middleware/    # Middlewares de autenticação e validação
├── services/      # Integração com Asaas
└── routes.ts      # Definição de todas as rotas
```

## APIs Disponíveis

### Autenticação
- `GET /api/auth/profile` - Perfil do usuário
- `POST /api/auth/asaas-account` - Criar conta Asaas
- `PUT /api/auth/profile` - Atualizar perfil

### Fundos
- `POST /api/funds` - Criar novo fundo
- `GET /api/funds` - Listar fundos do usuário
- `GET /api/funds/:fundId` - Detalhes do fundo
- `POST /api/funds/:fundId/deposit` - Depositar no fundo
- `POST /api/funds/:fundId/request-capital` - Solicitar capital

### Dívidas
- `GET /api/debts` - Dívidas do usuário
- `GET /api/funds/:fundId/debts` - Dívidas do fundo
- `GET /api/debts/:debtId` - Detalhes da dívida
- `POST /api/debts/:debtId/pay` - Pagar dívida

### Aprovações
- `PUT /api/approvals/:approvalId` - Aprovar/rejeitar solicitação

### Webhooks
- `POST /api/webhook/asaas` - Webhook Asaas para atualizações

### Utilitários
- `GET /api/health` - Status do sistema

## Banco de Dados

### Tabelas Principais
- **users**: Dados dos usuários e ID Asaas
- **funds**: Fundos colaborativos
- **fund_members**: Membros dos fundos
- **transactions**: Histórico de transações
- **approvals**: Solicitações de capital
- **debts**: Controle de dívidas

## Integrações

### Asaas (Pagamentos)
- Criação automática de subcontas
- Gestão de cobranças PIX
- Webhook para atualizações de status
- API completa para movimentações

### Replit Auth
- Autenticação JWT automática
- Criação de usuários transparente
- Validação de tokens

### PostgreSQL/Supabase
- Conexão via Drizzle ORM
- Migrações automáticas
- Relacionamentos complexos
- Queries otimizadas

## Segurança

### Implementadas
- Rate limiting (100 req/15min)
- CORS configurado
- Helmet para headers seguros
- Autenticação JWT obrigatória
- Validação de entrada com Zod

### Middleware de Autenticação
- Extração automática de tokens
- Criação transparente de usuários
- Controle de acesso por fundo

## Configuração

### Variáveis de Ambiente Necessárias
```env
DATABASE_URL=postgresql://...
ASAAS_API_KEY=sua_chave_asaas
ASAAS_ENVIRONMENT=sandbox|production
REPL_ID=id_do_repl
SESSION_SECRET=segredo_sessao
JWT_SECRET=segredo_jwt
NODE_ENV=development|production
```

### Scripts Disponíveis
- `npm run dev` - Executar em desenvolvimento
- `npx drizzle-kit generate` - Gerar migrações
- `npx drizzle-kit migrate` - Executar migrações

## Funcionalidades Implementadas

### Gestão de Usuários
✅ Autenticação via Replit Auth
✅ Criação automática de contas Asaas
✅ Perfis de usuário completos
✅ Níveis de conta (bronze, silver, gold, platinum)

### Gestão de Fundos
✅ Criação de fundos colaborativos
✅ Sistema de membros (admin/membro)
✅ Depósitos com validação
✅ Controle de saldos em tempo real

### Sistema de Aprovações
✅ Solicitações de capital
✅ Aprovação por administradores
✅ Criação automática de dívidas
✅ Histórico completo

### Controle de Dívidas
✅ Registro automático de dívidas
✅ Sistema de pagamentos parciais
✅ Histórico de pagamentos
✅ Status de dívidas (ativa/paga/vencida)

### Transações
✅ Histórico completo de movimentações
✅ Tipos: depósito, saque, pagamento dívida
✅ Integração com Asaas
✅ Status de transações

## Status da Implementação

### ✅ Concluído
- Estrutura completa do backend
- Todas as APIs principais
- Integração com Asaas
- Banco de dados configurado
- Autenticação Replit Auth
- Middleware de segurança
- Validação de dados
- Documentação completa

### ⚠️ Observações
- Alguns tipos TypeScript precisam de ajuste fino
- Webhooks Asaas necessitam configuração no painel
- Testes automatizados podem ser adicionados

### 🚀 Pronto para Uso
O backend está completamente funcional e pronto para receber requisições do frontend. Todas as funcionalidades principais estão implementadas com segurança e validação adequadas.