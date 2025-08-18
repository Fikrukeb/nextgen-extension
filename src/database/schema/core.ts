import { sql } from 'drizzle-orm';
import {
  pgTable as table,
  text,
  integer,
  uuid,
  varchar,
  index,
  boolean,
  numeric,
  date,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../helpers/columns.helpers';  
import { organization, leaseStatus } from '.';

export const building = table(
  'buildings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    code: text('code'), // unique per org
    address: text('address'),
    city: text('city'),
    country: text('country'),
    floors: integer('floors').default(1),
    description: text(), 
    ...timestamps,
  },
  (t) => ({
    orgIdx: index('buildings_org_idx').on(t.orgId),
    uniqueCodePerOrg: { unique: true, columns: [t.orgId, t.code] },
  }),
);

export const rooms = table(
  'room',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    buildingId: uuid('building_id')
      .notNull()
      .references(() => building.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // e.g., 201, A-12
    floor: integer('floor'),
    areaSqm: numeric('area_sqm', { precision: 10, scale: 2 }),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  },
  (t) => ({
    orgIdx: index('rooms_org_idx').on(t.orgId),
    buildingIdx: index('rooms_building_idx').on(t.buildingId),
    uniqueNamePerBuilding: { unique: true, columns: [t.buildingId, t.name] },
  }),
);

export const clients = table(
  'client',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    contactEmail: text('contact_email'),
    contactPhone: text('contact_phone'),
    taxId: text('tax_id'),
    billingAddress: text('billing_address'),
    note: text('note'),
    ...timestamps,
  },
  (t) => ({
    orgIdx: index('clients_org_idx').on(t.orgId),
  }),
);

export const leases = table(
  'leases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    roomId: uuid('room_id')
      .notNull()
      .references(() => rooms.id, { onDelete: 'restrict' }),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'restrict' }),
    status: leaseStatus('status').default('draft').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    // Pricing
    rentAmount: numeric('rent_amount', { precision: 12, scale: 2 }).notNull(),
    rentCurrency: text('rent_currency').default('ETB').notNull(),
    billingCycleDays: integer('billing_cycle_days').default(30).notNull(), // 30 for monthly
    securityDeposit: numeric('security_deposit', { precision: 12, scale: 2 }),
    gracePeriodDays: integer('grace_period_days').default(5).notNull(),
    // Indexing & timestamps
    ...timestamps,
  },
  (t) => ({
    orgIdx: index('leases_org_idx').on(t.orgId),
    roomIdx: index('leases_room_idx').on(t.roomId),
    clientIdx: index('leases_client_idx').on(t.clientId),
    uniqueActivePerRoom: {
      // a single active lease per room
      unique: true,
      columns: [t.roomId, t.status],
      where: sql`status = 'active'`,
    },
  }),
);
