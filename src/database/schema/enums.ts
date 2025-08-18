import { pgEnum } from "drizzle-orm/pg-core";
export const leaseStatus   = pgEnum("lease_status", ["draft","active","suspended","terminated","expired"]);
export const invoiceStatus = pgEnum("invoice_status", ["draft","issued","partial","paid","overdue","void"]);
export const paymentMethod = pgEnum("payment_method", ["cash","bank_transfer","card","mobile_money","check","other"]);
export const notifyType    = pgEnum("notify_type", ["upcoming_due","overdue","lease_expiry","low_balance"]);
export const orgRole       = pgEnum("org_role", ["owner","admin","manager","accountant","viewer"]);
