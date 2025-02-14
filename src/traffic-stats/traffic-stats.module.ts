import { Module } from '@nestjs/common';
import { TrafficStatsController } from './traffic-stats.controller';
import { TrafficStatsService } from './traffic-stats.service';

@Module({
  controllers: [TrafficStatsController],
  providers: [TrafficStatsService],
})
export class TrafficStatsModule {}
