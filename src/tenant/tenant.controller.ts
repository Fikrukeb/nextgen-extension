import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'; 
import { AuthGuard } from '@mguay/nestjs-better-auth';

@Controller('tenant')
@UseGuards(AuthGuard)
export class TenantController {
  // constructor(private readonly orgService: TenantService) {}

  @Get('all')
  async getTenants() {
    // return await this.orgService.organizations();
  }

  @Post('create')
  async createTenant(
    @Body()
    data: {
      name: string;
      slug: string;
      logo: string;
      metadata: string;
      userName: string;
      email: string;
      password: string;
    },
  ) {
    // return await this.orgService.createOrganization(data);
  }
}
