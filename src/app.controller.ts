import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('import-recommendation')
  importRecommendation() {
    return this.appService.importFromFile({
      crop: 'Wheat',
      fertilizerType: 'N',
      filePath: 'file_name.csv',
    });
  }

  @Get('import-from-file')
  importAllFiles() {
    return this.appService.importAllFromFile();
  }

  @Get('get-recommendation')
  getRecommendation(@Query('lat') lat: number, @Query('lon') lon: number) {
    return this.appService.getRecommendation(lat, lon);
  }
}
