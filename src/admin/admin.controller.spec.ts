import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ReturnedAdminDto } from './dto/returned-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

describe('AdminController', () => {
  // Define the variable used in the tests
  let adminController: AdminController;
  let returnedAdminDto: ReturnedAdminDto;

  // Create a mock admin service object with the required methods
  const mockAdminService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  }

  // Before each test, create a new module with the AdminService and the mock model
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
      ],
    }).compile();
    // Get the AdminController from the module created
    adminController = module.get<AdminController>(AdminController);
    // returnedAdminDto object to return the created admin
    returnedAdminDto = {
      id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'text@example.com',
      roles: [],
      avatar: '',
      changePassword: false,
    };
  });

  // After each test, clear all the mocks
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });


  // Test the create method of the AdminController
  describe('create', () => {
    // Define the variables used in the tests
    let createAdminDto: CreateAdminDto;

    // Before each test, create a new createAdminDto object
    beforeEach(() => {
      createAdminDto = {
        name: 'John Doe',
        email: 'test@example.com',
      };
    });

    // Test successful creation of a new admin account
    it('should create a new admin account', async () => {
      // Mock the create method of the AdminService
      mockAdminService.create.mockResolvedValue(returnedAdminDto);
      // Call the create method of the AdminController
      const result = await adminController.create(createAdminDto);
      // Expect the result to be the returnedAdminDto object
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminService.create).toHaveBeenCalledWith(createAdminDto);
    });

    // Test failed creation of a new admin account with error
    it('should throw an error', async () => {
      // Mock the create method of the AdminService to throw an error
      mockAdminService.create.mockRejectedValue(new Error('Error creating admin'));
      // Call the create method of the AdminController
      await expect(adminController.create(createAdminDto)).rejects.toThrow(new Error('Error creating admin'));
      expect(mockAdminService.create).toHaveBeenCalledWith(createAdminDto);
    });
  });


  // Test the findAll method of the AdminController
  describe('findAll', () => {
    // Test successful retrieval of all admin accounts
    it('should return all admin accounts', async () => {
      // Mock the findAll method of the AdminService
      mockAdminService.findAll.mockResolvedValue([returnedAdminDto]);
      // Call the findAll method of the AdminController
      const result = await adminController.findAll();
      // Expect the result to be an array with the returnedAdminDto object
      expect(result).toEqual([returnedAdminDto]);
      expect(mockAdminService.findAll).toHaveBeenCalled();
    });

    // Test failed retrieval of all admin accounts with error
    it('should throw an error', async () => {
      // Mock the findAll method of the AdminService to throw an error
      mockAdminService.findAll.mockRejectedValue(new Error('Error retrieving admin accounts'));
      // Call the findAll method of the AdminController
      await expect(adminController.findAll()).rejects.toThrow(new Error('Error retrieving admin accounts'));
      expect(mockAdminService.findAll).toHaveBeenCalled();
    });
  });


  // Test the findOne method of the AdminController
  describe('findOne', () => {
    // Test successful retrieval of an admin account by id
    it('should return an admin account by id', async () => {
      // Mock the findOne method of the AdminService
      mockAdminService.findOne.mockResolvedValue(returnedAdminDto);
      // Call the findOne method of the AdminController
      const result = await adminController.findOne('507f1f77bcf86cd799439011');
      // Expect the result to be the returnedAdminDto object
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminService.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    // Test failed retrieval of an admin account by id with error
    it('should throw an error', async () => {
      // Mock the findOne method of the AdminService to throw an error
      mockAdminService.findOne.mockRejectedValue(new Error('Error retrieving admin account'));
      // Call the findOne method of the AdminController
      await expect(adminController.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(new Error('Error retrieving admin account'));
      expect(mockAdminService.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });


  // Test the remove method of the AdminController
  describe('remove', () => {
    // Test successful deletion of an admin account by id
    it('should delete an admin account by id', async () => {
      // Mock the remove method of the AdminService
      mockAdminService.remove.mockResolvedValue({ message: 'Admin deleted successfully' });
      // Call the remove method of the AdminController
      const result = await adminController.remove('507f1f77bcf86cd799439011');
      // Expect the result to be the message object
      expect(result).toEqual({ message: 'Admin deleted successfully' });
      expect(mockAdminService.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    // Test failed deletion of an admin account by id with error
    it('should throw an error', async () => {
      // Mock the remove method of the AdminService to throw an error
      mockAdminService.remove.mockRejectedValue(new Error('Error deleting admin account'));
      // Call the remove method of the AdminController
      await expect(adminController.remove('507f1f77bcf86cd799439011')).rejects.toThrow(new Error('Error deleting admin account'));
      expect(mockAdminService.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
