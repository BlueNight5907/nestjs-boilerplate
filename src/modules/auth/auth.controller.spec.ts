import { Test, type TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';

describe('AuthController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  describe('root', () => {
    it('should return "http://localhost"', () => {
      expect(app).toBeDefined();
    });
  });
});
