import { Injectable } from '@nestjs/common';
import { VisitData } from './traffic-stats.interface';

@Injectable()
export class TrafficStatsService {
  // Эмулирует получение данных о посещениях с задержкой
  private async getVisitsData(): Promise<VisitData[]> {
    return await this.simulateDbDelay();
  }

  // Фильтрует данные по времени (последний час)
  private filterDataByTime(data: VisitData[]): VisitData[] {
    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

    return data.filter(({ timestamp }) => {
      const itemTime = new Date(timestamp);
      return itemTime >= oneHourAgo && itemTime <= currentTime;
    });
  }

  // Агрегирует количество посещений из отфильтрованных данных
  private aggregateVisits(data: VisitData[]): number {
    return data.reduce((total, { visits }) => total + visits, 0);
  }

  // Имитация задержки для эмуляции работы с базой данных
  private async simulateDbDelay(): Promise<VisitData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentTime = new Date();
        const timeStamps = [
          currentTime.toISOString(),
          new Date(currentTime.getTime() - 10 * 60 * 1000).toISOString(),
          new Date(currentTime.getTime() - 30 * 60 * 1000).toISOString(),
          new Date(currentTime.getTime() - 45 * 60 * 1000).toISOString(),
          new Date(currentTime.getTime() - 60 * 60 * 1000).toISOString(),
        ];

        const visitsData = timeStamps.map((timestamp, index) => ({
          visits: (index + 1) * 10,
          timestamp,
        }));

        resolve(visitsData);
      }, 500); // Задержка 500 мс
    });
  }

  // Метод для получения общего количества посещений
  async getTotalVisits(): Promise<number> {
    const visitsData: VisitData[] = await this.getVisitsData();
    const filteredData: VisitData[] = this.filterDataByTime(visitsData);

    // Агрегируем данные по посещениям
    return this.aggregateVisits(filteredData);
  }
}
