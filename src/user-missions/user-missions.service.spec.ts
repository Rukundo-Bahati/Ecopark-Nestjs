import { Test, TestingModule } from '@nestjs/testing';
import { UserMissionsService } from './user-missions.service';

describe('UserMissionsService', () => {
  let service: UserMissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMissionsService],
    }).compile();

    service = module.get<UserMissionsService>(UserMissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
