import { Injectable } from '@nestjs/common';
import { VisitData } from './traffic-stats.interface';

@Injectable()
export class TrafficStatsService {
  // Эмулирует получение данных о посещениях с задержкой
  private async getVisitsData(): Promise<VisitData[]> {
    try {
      return await this.simulateDbDelay();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // Фильтрует данные по времени (последний час)
  // private filterDataByTime(data: VisitData[]): VisitData[] {
  //   const currentTime = new Date();
  //   const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  //
  //   return data.filter(({ timestamp }) => {
  //     const itemTime = new Date(timestamp);
  //     return itemTime >= oneHourAgo && itemTime <= currentTime;
  //   });
  // }

  //Оптимизация метода
  private filterDataByTime(data: VisitData[]): VisitData[] {
    const currentTime = Date.now();
    const oneHourAgo = currentTime - 60 * 60 * 1000;
    const result: VisitData[] = [];

    for (const item of data) {
      const itemTime = Date.parse(item.timestamp);
      if (itemTime >= oneHourAgo && itemTime <= currentTime) {
        result.push(item);
      }
    }

    return result;
  }


  // // Агрегирует количество посещений из отфильтрованных данных
  // private aggregateVisits(data: VisitData[]): number {
  //   return data.reduce((total, { visits }) => total + visits, 0);
  // }

  //Оптимизация
  private aggregateVisits(data: VisitData[]): number {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].visits;
    }
    return total;
  }

  // Имитация задержки для эмуляции работы с базой данных
  // private async simulateDbDelay(): Promise<VisitData[]> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const currentTime = new Date();
  //       const timeStamps = [
  //         currentTime.toISOString(),
  //         new Date(currentTime.getTime() - 10 * 60 * 1000).toISOString(),
  //         new Date(currentTime.getTime() - 30 * 60 * 1000).toISOString(),
  //         new Date(currentTime.getTime() - 45 * 60 * 1000).toISOString(),
  //         new Date(currentTime.getTime() - 60 * 60 * 1000).toISOString(),
  //       ];
  //
  //       const visitsData = timeStamps.map((timestamp, index) => ({
  //         visits: (index + 1) * 10,
  //         timestamp,
  //       }));
  //
  //       resolve(visitsData);
  //     }, 500); // Задержка 500 мс
  //   });
  // }

  //Оптимизация
  private async simulateDbDelay(): Promise<VisitData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Имитация задержки

    const currentTime = Date.now();
    const intervals = [0, 10, 30, 45, 60];
    const visitsData: VisitData[] = new Array(intervals.length);

    for (let i = 0; i < intervals.length; i++) {
      visitsData[i] = {
        visits: (i + 1) * 10,
        timestamp: new Date(currentTime - intervals[i] * 60 * 1000).toISOString(),
      };
    }

    return visitsData;
  }


  // Метод для получения общего количества посещений
  public async getTotalVisits(): Promise<number> {
    let visitsData: VisitData[] = [];
    let filteredVisits: VisitData[] = [];

    try {
      visitsData = await this.getVisitsData();
    } catch (e) {
      throw new Error(e.message);
    }

    if (!visitsData.length) {
      throw new Error('данные с БД пустые');
    }

    filteredVisits = this.filterDataByTime(visitsData);

    if (!filteredVisits.length) {
      throw new Error('Ошибка фильтрации данных');
    }

    // Агрегируем данные по посещениям
    return this.aggregateVisits(filteredVisits);
  }
}
