import {
  pgTable as table,
  varchar,
  index,
  serial,
  geometry,
  doublePrecision, 
} from 'drizzle-orm/pg-core';

import { timestamps } from '../helpers/columns.helpers';

export const recommendation = table(
  'recommendation',
  {
    id: serial('id').primaryKey(),
    crop: varchar('crop', { length: 255 }).notNull(),
    fertilizerType: varchar('fertilizer_type', { length: 255 }).notNull(),
    value: doublePrecision('value'),
    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),
    region: varchar('region', { length: 255 }).notNull(),
    zone: varchar('zone', { length: 255 }).notNull(),
    woreda: varchar('woreda', { length: 255 }).notNull(),
    kebebe: varchar('kebebe', { length: 255 }).notNull(),
    lat: doublePrecision('lat').notNull(),
    lon: doublePrecision('lon').notNull(),
    ...timestamps,
  },
  (t) => ({
    locationIdx: index('spatial_index').using('gist', t.location),
  }),
);