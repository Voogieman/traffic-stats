import { Module } from '@nestjs/common';
import { TrafficStatsModule } from './traffic-stats/traffic-stats.module';

@Module({
  imports: [TrafficStatsModule],
})
export class AppModule {}
