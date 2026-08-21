import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('warm')
  @HttpCode(HttpStatus.OK)
  warm() {
    return this.healthService.warmDB();
  }
}
