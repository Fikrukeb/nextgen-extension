import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { notifyType } from './enums'; 
import { invoices, leases, organization, user } from '.';
import { timestamps } from '../helpers/columns.helpers';

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    type: notifyType('type').notNull(),
    invoiceId: uuid('invoice_id').references(() => invoices.id, {
      onDelete: 'set null',
    }),
    leaseId: uuid('lease_id').references(() => leases.id, {
      onDelete: 'set null',
    }),
    recipientUserId: uuid('recipient_user_id').references(() => user.id),
    recipientEmail: text('recipient_email'),
    scheduledFor: timestamp('scheduled_for'),
    sentAt: timestamp('sent_at'),
    success: boolean('success'),
    message: text('message'),
    ...timestamps,
  },
  (t) => ({
    orgIdx: index('notifications_org_idx').on(t.orgId),
    byType: index('notifications_type_idx').on(t.type),
    byWhen: index('notifications_schedule_idx').on(t.scheduledFor),
  }),
);
