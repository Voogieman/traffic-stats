import { Controller, Get } from '@nestjs/common';
import { TrafficStatsService } from './traffic-stats.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('traffic-stats')
export class TrafficStatsController {
  constructor(private readonly trafficStatsService: TrafficStatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить общее количество посещений за последний час',
  })
  @ApiResponse({
    status: 200,
    description: 'Общее количество посещений',
    type: Number,
  })
  async getTrafficStats(): Promise<{ totalVisits: number }> {
    try {
      const totalVisits  = await this.trafficStatsService.getTotalVisits();
      return { totalVisits };
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
