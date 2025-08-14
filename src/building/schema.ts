import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const building = pgTable('building', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  floors: integer('floors').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
