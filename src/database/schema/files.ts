// db/schema/files.ts
import { pgTable, uuid, text, index } from 'drizzle-orm/pg-core';
import { leases, clients } from './core'; 
import { organization, user } from '.';
import { timestamps } from '../helpers/columns.helpers';

export const attachments = pgTable(
  'attachments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    fileUrl: text('file_url').notNull(),
    fileName: text('file_name'),
    mimeType: text('mime_type'),
    // Polymorphic: attach to a client or lease (extend as needed)
    leaseId: uuid('lease_id').references(() => leases.id, {
      onDelete: 'cascade',
    }),
    clientId: uuid('client_id').references(() => clients.id, {
      onDelete: 'cascade',
    }),
    uploadedBy: uuid('uploaded_by').references(() => user.id),
    ...timestamps,
  },
  (t) => ({
    orgIdx: index('attachments_org_idx').on(t.orgId),
  }),
);
