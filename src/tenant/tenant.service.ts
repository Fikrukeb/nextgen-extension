import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from '../auth/schema';

@Injectable()
export class TenantService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}
  async organizations() {
    return this.database.transaction(async (tx) => {
      return await tx.select().from(schema.organization);
    });
  }

  async createOrganization(data: {
    name: string;
    slug: string;
    logo: string;
    metadata: string;
    userId: string;
  }) {
    return this.database.transaction(async (tx) => {
      const org = await tx
        .insert(schema.organization)
        .values({
          name: data.name,
          slug: data.slug,
          logo: data.logo,
          metadata: data.metadata,
          createdAt: new Date(),
        })
        .returning({ id: schema.organization.id });

      const membership = await tx
        .insert(schema.member)
        .values({
          userId: data.userId,
          organizationId: org[0].id,
          createdAt: new Date(),
          role: 'admin',
        })
        .returning({ id: schema.organization.id });

      return {
        message: 'Tenant created successfully',
        data: {
          org: org,
          membership: membership,
        },
      };
    });
  }
  //   async createOganizationMemebership(data: {
  //     name: string;
  //     slug: string;
  //     logo: string;
  //     metadata: string;
  //   }) {
  //     return this.database.transaction(async (tx) => {
  //       return await tx
  //         .insert(schema.member)
  //         .values({

  //         })
  //         .returning({ id: schema.organization.id });
  //     });
  //   }
}
