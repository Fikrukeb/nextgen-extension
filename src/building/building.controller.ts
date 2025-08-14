import { Body, Controller, Get, Post } from '@nestjs/common';
import { BuildingService } from './building.service';

@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get('all')
  async getAllBuildings() {
    return await this.buildingService.getBuildings();
  }

  @Post('create')
  async createBuilding(@Body() data: { name: string; floors: number }) {
    return this.buildingService.createBuildings(data as any);
  }
}
