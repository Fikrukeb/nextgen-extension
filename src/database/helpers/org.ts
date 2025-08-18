import { eq, and } from "drizzle-orm";
export const byOrg = <T extends { orgId: any }>(table: T, orgId: string) =>
  eq(table.orgId, orgId);