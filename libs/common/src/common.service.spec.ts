import { Test, TestingModule } from '@nestjs/testing';
import { Dayjs } from 'dayjs';
import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return SuccessTimestamp class instance', () => {
    const result = service.successTimestamp();

    expect(result.success).toBeTruthy();
    expect(result.timestamp).toBeInstanceOf(Dayjs);
  });

  it('should return SuccessTimestamp class instance when success argument exists', () => {
    const result = service.successTimestamp(false);

    expect(result.success).toBeFalsy();
    expect(result.timestamp).toBeInstanceOf(Dayjs);
  });
});
