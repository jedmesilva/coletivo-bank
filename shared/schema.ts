import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Replit user ID
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  asaasCustomerId: text("asaas_customer_id"), // ID da subconta no Asaas
  accountLevel: text("account_level").default("bronze"), // bronze, silver, gold, platinum
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Funds table
export const funds = pgTable("funds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  growth: decimal("growth", { precision: 5, scale: 2 }).default("0.00"),
  contributionRate: decimal("contribution_rate", { precision: 5, scale: 2 }).default("100.00"), // Taxa de contribuição: % que o membro deve ter contribuído em relação ao valor solicitado (0-1000%)
  interestRate: decimal("interest_rate", { precision: 4, scale: 2 }).default("0.00"), // Taxa de juros anual (0-12%)
  approvalType: text("approval_type").default("quorum"), // 'quorum' ou 'unanimous'
  minimumQuorum: integer("minimum_quorum").default(50), // Percentual mínimo para quórum (1-100%)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fund members relationship
export const fundMembers = pgTable("fund_members", {
  id: serial("id").primaryKey(),
  fundId: uuid("fund_id").references(() => funds.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("member"), // admin, member
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Transactions/History
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  fundId: uuid("fund_id").references(() => funds.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // deposit, withdrawal, debt-payment
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  asaasTransactionId: text("asaas_transaction_id"), // ID da transação no Asaas
  status: text("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Capital requests/Approvals
export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  fundId: uuid("fund_id").references(() => funds.id, { onDelete: "cascade" }),
  requesterId: text("requester_id").references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  description: text("description"),
  status: text("status").default("pending"), // pending, approved, rejected
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Debts
export const debts = pgTable("debts", {
  id: uuid("id").primaryKey().defaultRandom(),
  fundId: uuid("fund_id").references(() => funds.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").default("active"), // active, paid, overdue
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  fundMembers: many(fundMembers),
  transactions: many(transactions),
  approvals: many(approvals),
  debts: many(debts),
}));

export const fundsRelations = relations(funds, ({ many }) => ({
  members: many(fundMembers),
  transactions: many(transactions),
  approvals: many(approvals),
  debts: many(debts),
}));

export const fundMembersRelations = relations(fundMembers, ({ one }) => ({
  fund: one(funds, {
    fields: [fundMembers.fundId],
    references: [funds.id],
  }),
  user: one(users, {
    fields: [fundMembers.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  fund: one(funds, {
    fields: [transactions.fundId],
    references: [funds.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  fund: one(funds, {
    fields: [approvals.fundId],
    references: [funds.id],
  }),
  requester: one(users, {
    fields: [approvals.requesterId],
    references: [users.id],
  }),
}));

export const debtsRelations = relations(debts, ({ one }) => ({
  fund: one(funds, {
    fields: [debts.fundId],
    references: [funds.id],
  }),
  user: one(users, {
    fields: [debts.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertFundSchema = createInsertSchema(funds);
export const selectFundSchema = createSelectSchema(funds);

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

export const insertApprovalSchema = createInsertSchema(approvals);
export const selectApprovalSchema = createSelectSchema(approvals);

export const insertDebtSchema = createInsertSchema(debts);
export const selectDebtSchema = createSelectSchema(debts);

export const insertFundMemberSchema = createInsertSchema(fundMembers);
export const selectFundMemberSchema = createSelectSchema(fundMembers);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Fund = typeof funds.$inferSelect;
export type InsertFund = typeof funds.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export type Approval = typeof approvals.$inferSelect;
export type InsertApproval = typeof approvals.$inferInsert;

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = typeof debts.$inferInsert;

export type FundMember = typeof fundMembers.$inferSelect;
export type InsertFundMember = typeof fundMembers.$inferInsert;
