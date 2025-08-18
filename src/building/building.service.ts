import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from '../database/schema/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class BuildingService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}
  async getBuildings() {
    return this.database.transaction(async (tx) => {
      return await tx.select().from(schema.building);
    });
  }

  async createBuildings(data: { name: string; floors: number }) {
    return this.database.transaction(async (tx) => {
      // return await tx
      //   .insert(schema.building)
      //   .values({
      //     floors: data.floors,
      //     name: data.name,
      //     orgId
      //   })
      //   .returning({ id: schema.building.id });
    });
  }
}
