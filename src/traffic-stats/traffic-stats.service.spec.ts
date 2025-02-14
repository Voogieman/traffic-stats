import { Test, TestingModule } from '@nestjs/testing';
import { TrafficStatsService } from './traffic-stats.service';
import { VisitData } from './traffic-stats.interface';

describe('TrafficStatsService', () => {
  let service: TrafficStatsService;
  const currentTime = new Date(); // Текущее время для всех тестов
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // Один час назад

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficStatsService],
    }).compile();

    service = module.get<TrafficStatsService>(TrafficStatsService);

    // Мокаем приватные методы с использованием any
    jest.spyOn(service as any, 'getVisitsData').mockResolvedValue([
      { visits: 10, timestamp: currentTime.toISOString() },
      { visits: 20, timestamp: oneHourAgo.toISOString() },
      {
        visits: 5,
        timestamp: new Date(
          currentTime.getTime() - 30 * 60 * 1000,
        ).toISOString(),
      },
    ]);

    jest
      .spyOn(service as any, 'filterDataByTime')
      .mockImplementation((data: VisitData[]) => {
        const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
        return data.filter(
          (item) =>
            new Date(item.timestamp) >= oneHourAgo &&
            new Date(item.timestamp) <= currentTime,
        );
      });

    jest
      .spyOn(service as any, 'aggregateVisits')
      .mockImplementation((data: VisitData[]) => {
        return data.reduce((total, item) => total + item.visits, 0);
      });
  });

  it('должен корректно агрегировать количество посещений за последний час', async () => {
    // Эмулируем данные с временными метками за последний час
    const visitsData: VisitData[] = [
      { visits: 10, timestamp: currentTime.toISOString() }, // Текущее время
      { visits: 20, timestamp: oneHourAgo.toISOString() }, // Один час назад
      {
        visits: 5,
        timestamp: new Date(
          currentTime.getTime() - 30 * 60 * 1000,
        ).toISOString(),
      }, // Полчаса назад
    ];

    // Мокаем метод getVisitsData
    jest.spyOn(service as any, 'getVisitsData').mockResolvedValue(visitsData);

    // Мокаем метод filterDataByTime (с фильтрацией за последний час)
    jest
      .spyOn(service as any, 'filterDataByTime')
      .mockImplementation((data: VisitData[]) => {
        const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
        // Возвращаем только те данные, которые находятся в пределах последнего часа
        return data.filter(
          (item) =>
            new Date(item.timestamp) >= oneHourAgo &&
            new Date(item.timestamp) <= currentTime,
        );
      });

    // Мокаем метод aggregateVisits
    jest
      .spyOn(service as any, 'aggregateVisits')
      .mockImplementation((data: VisitData[]) => {
        return data.reduce((total, item) => total + item.visits, 0);
      });

    // Получаем результат
    const result = await service.getTotalVisits();

    // Проверяем, что результат правильный
    expect(result).toBe(35); // Ожидаем сумму 35 (10 + 20 + 5)
  });

  it('должен вернуть 0, если данные о посещениях пустые', async () => {
    // Мокаем пустой ответ для getVisitsData
    jest.spyOn(service as any, 'getVisitsData').mockResolvedValue([]);
    const result = await service.getTotalVisits();
    expect(result).toBe(0); // Ожидаем 0, так как нет данных
  });
});
