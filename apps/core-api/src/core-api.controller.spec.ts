import { Test, TestingModule } from '@nestjs/testing';
import { CoreApiController } from './core-api.controller';
import { CoreApiService } from './core-api.service';

describe('CoreApiController', () => {
  let coreApiController: CoreApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreApiController],
      providers: [CoreApiService],
    }).compile();

    coreApiController = app.get<CoreApiController>(CoreApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(coreApiController.getHello()).toBe('Hello World!');
    });
  });
});
