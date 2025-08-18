import { pgTable, uuid, text, numeric, timestamp, date, index } from "drizzle-orm/pg-core"; 
import { leases } from "./core";
import { invoiceStatus, paymentMethod } from "./enums";
import { sql } from "drizzle-orm";
import { organization, user } from ".";

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  leaseId: uuid("lease_id").notNull().references(() => leases.id, { onDelete: "cascade" }),
  number: text("number").notNull(), // display id; unique per org
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("ETB").notNull(),
  status: invoiceStatus("status").default("issued").notNull(),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => user.id),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (t) => ({
  orgIdx: index("invoices_org_idx").on(t.orgId),
  leaseIdx: index("invoices_lease_idx").on(t.leaseId),
  uniqueNumberPerOrg: { unique: true, columns: [t.orgId, t.number] },
}));

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: paymentMethod("method").default("bank_transfer").notNull(),
  reference: text("reference"), // bank slip no., Tx id, etc
  paidAt: timestamp("paid_at").default(sql`now()`).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
}, (t) => ({
  orgIdx: index("payments_org_idx").on(t.orgId),
  invoiceIdx: index("payments_invoice_idx").on(t.invoiceId),
}));