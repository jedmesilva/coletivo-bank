# Fundos Colaborativos - Sistema de Crédito Coletivo

## Overview

This is a collaborative credit circle application built with React and TypeScript, designed to facilitate group funding and payment management. The application allows users to create and manage collective funds, make deposits, request capital, and handle debt payments through integration with Asaas payment gateway.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: React Context API for global application state
- **Routing**: React Router DOM for client-side navigation
- **Data Fetching**: TanStack React Query for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript (mentioned in README_BACKEND.md)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration
- **Payment Processing**: Asaas API integration
- **Security**: Helmet, CORS, and rate limiting middleware

## Key Components

### Core Features
1. **Fund Management**: Create, view, and manage collaborative funds
2. **Deposit System**: Make contributions to funds with PIX integration
3. **Capital Requests**: Request withdrawals from funds with approval workflow
4. **Debt Management**: Track and pay outstanding debts
5. **User Authentication**: Secure login and profile management
6. **Responsive Design**: Mobile-first approach with progressive web app features

### UI Architecture
- **Component Structure**: Modular components with consistent design patterns
- **Navigation**: Bottom navigation for mobile, sidebar menu for desktop
- **Sheets and Modals**: Bottom sheets for mobile interactions
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User feedback system

### Data Models
- **Users**: Profile management with account levels (bronze, silver, gold, platinum)
- **Funds**: Collaborative funding pools with member management
- **Transactions**: Deposits, withdrawals, and debt payments
- **Approvals**: Workflow for fund withdrawal requests

## Data Flow

1. **User Authentication**: Replit Auth → User Context → Protected Routes
2. **Fund Operations**: User Actions → Context State → Backend APIs → Database
3. **Payment Processing**: User Requests → Asaas Integration → Transaction Confirmation
4. **Real-time Updates**: Context State Management → Component Re-renders

## External Dependencies

### Payment Integration
- **Asaas API**: Brazilian payment gateway for PIX, boleto, and card processing
- **Environment**: Supports both sandbox and production environments

### Authentication
- **Replit Auth**: Integrated authentication system
- **JWT**: Token-based session management

### Database
- **PostgreSQL**: Primary data storage
- **Drizzle ORM**: Type-safe database operations with migrations

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **Recharts**: Data visualization components

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server on port 8080
- **Hot Reload**: Automatic code reloading during development
- **Environment Variables**: Separate configuration for development and production

### Production Deployment
- **Build Process**: Vite build with TypeScript compilation
- **Static Assets**: Optimized bundling and code splitting
- **Environment Configuration**: Production-specific settings for Asaas and database

### Replit Integration
- **Autoscale Deployment**: Configured for Replit's autoscale platform
- **Port Configuration**: Multiple ports for different services
- **Workflow Management**: Automated startup and monitoring

## Changelog
- June 20, 2025. Initial setup
- June 20, 2025. Updated account page Pix section: changed title to "Ações", updated button labels to "Receber Pix" and "Enviar Pix", improved responsive layout with grid system

## User Preferences

Preferred communication style: Simple, everyday language.