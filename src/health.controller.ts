import { Controller, Get } from '@nestjs/common';

@Controller() // This makes the controller handle the root path
export class HealthController {
  @Get()
  checkHealth(): string {
    return 'OK'; // Basic health check response
  }
}
