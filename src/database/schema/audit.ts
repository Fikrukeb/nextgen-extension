// db/schema/audit.ts
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull(),        // tenant required
  userId: uuid("user_id").notNull(),      // actor
  entity: text("entity").notNull(),       // table name
  entityId: uuid("entity_id").notNull(),  // row id
  action: text("action").notNull(),       // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});
