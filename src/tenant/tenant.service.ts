export abstract class TenantBaseService<T> {
  constructor(protected db: any) {}

  protected withTenant(query: any, orgId: string) {
    return { ...query, organizationId: orgId };
  }
}