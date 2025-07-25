import { Test, TestingModule } from '@nestjs/testing';
import { UserMissionsController } from './user-missions.controller';
import { UserMissionsService } from './user-missions.service';

describe('UserMissionsController', () => {
  let controller: UserMissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMissionsController],
      providers: [UserMissionsService],
    }).compile();

    controller = module.get<UserMissionsController>(UserMissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
