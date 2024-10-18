import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe.skip('AuthController', () => {
  // Define the variables that will be used in the tests
  let authController: AuthController;

  //   let mockAuthService: AuthService;
  const mockAuthService = {
    login: jest.fn(),
  };


  beforeEach(async () => {
    // Initialize the module with the AuthController and AuthService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compile();
    // Get the AuthController from the module
    authController = module.get<AuthController>(AuthController);
  });

  // After each test, reset the mocks
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

});
