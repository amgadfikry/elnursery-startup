import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { EmailService } from '../common/email.service';
import { ReturnedAdminDto } from './dto/returned-admin.dto';
import { Admin } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { TransactionService } from '../transaction/transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import { PasswordService } from '../password/password.service';
import { InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('AdminService', () => {
  // Define the variables used in the tests
  let adminService: AdminService;
  let returnedAdminDto: ReturnedAdminDto;

  // Create a mock model object admin model with the required methods
  const mockAdminModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  }
  // Create mock password service for the tests
  const mockPasswordService = {
    generateRandomPassword: jest.fn(),
    hashPassword: jest.fn(),
  }
  // Create mock email service for the tests
  const mockEmailService = {
    sendAccountCredentials: jest.fn(),
  }
  // Create mock transaction service for the tests
  const mockTransactionService = {
    withTransaction: jest.fn(),
  }

  // Before each test, create a new module with the AdminService and the mock model
  beforeEach(async () => {
    // Create a new module with the AdminService and the mock model
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService,
        { provide: getModelToken(Admin.name), useValue: mockAdminModel },
        { provide: EmailService, useValue: mockEmailService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    })
    .compile();

    // Get the All the required services from the module created
    adminService = module.get<AdminService>(AdminService);
    // returnedAdminDto object to return the created admin
    returnedAdminDto = {
      id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'email@example.com',
      roles: [],
      avatar: '',
      changePassword: false,
    };
  });

  // After each test, clear all the mocks
  afterEach(() => {
    jest.clearAllMocks();
  });


  // Test the create method of the AdminService
  describe('create', () => {
    // Define the variables used in the tests
    let createAdminDto: CreateAdminDto;
    let password: string;
    let hashedPassword: string;

    // Before each test, create a new createAdminDto, returnedAdminDto, password and hashedPassword
    beforeEach(() => {
      // creaAdminDto object to create a new admin
      createAdminDto = {
        name: 'John Doe',
        email: 'email@example.com',
      }
      // password and hashedPassword for the admin account
      password = 'password';
      hashedPassword = 'hashedPassword';
    });

    // Test success scenario for the create method of the AdminService
    it('should create a new admin and return it', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.create.mockResolvedValue([returnedAdminDto]);
      mockEmailService.sendAccountCredentials.mockResolvedValue('sent');
      mockPasswordService.generateRandomPassword.mockReturnValue(password);
      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockTransactionService.withTransaction.mockImplementation(async (cb) => await cb());
      // Call the create method of the AdminService
      const result = await adminService.create(createAdminDto);
      // Check the expected result and the method calls
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminModel.create).toHaveBeenCalledWith(
        [{ ...createAdminDto, password: hashedPassword }],
        { session: undefined },
      );
      expect(mockEmailService.sendAccountCredentials).toHaveBeenCalledWith(createAdminDto.name, createAdminDto.email, password);
      expect(mockPasswordService.generateRandomPassword).toHaveBeenCalled();
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(password);
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
    });

    // Test failure scenario with fail transaction
    it('should throw an error if the transaction fails', async () => {
      // Mock the required methods with the required return values
      mockTransactionService.withTransaction.mockRejectedValue(new Error('error'));
      // Call the create method of the AdminService and expect it to throw an error
      await expect(adminService.create(createAdminDto)).rejects.toThrow('error');
      // Check the method calls
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
      
    });

    // Test failure scenario with fail email sending
    it('should throw an error if the email sending fails', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.create.mockResolvedValue([returnedAdminDto]);
      mockEmailService.sendAccountCredentials.mockRejectedValue(new Error('error'));
      mockPasswordService.generateRandomPassword.mockReturnValue(password);
      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockTransactionService.withTransaction.mockImplementation(async (cb) => await cb());
      // Call the create method of the AdminService and expect it to throw an error
      await expect(adminService.create(createAdminDto)).rejects.toThrow('error');
      // Check the method calls
      expect(mockAdminModel.create).toHaveBeenCalledWith(
        [{ ...createAdminDto, password: hashedPassword }],
        { session: undefined },
      );
      expect(mockEmailService.sendAccountCredentials).toHaveBeenCalledWith(createAdminDto.name, createAdminDto.email, password);
      expect(mockPasswordService.generateRandomPassword).toHaveBeenCalled();
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(password);
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
    });

    // Test failure scenario with conflict error
    it('should throw an error if the admin with the email already exists', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.create.mockRejectedValue({ code: 11000 });
      mockTransactionService.withTransaction.mockImplementation(async (cb) => await cb());
      // Call the create method of the AdminService and expect it to throw an error
      await expect(adminService.create(createAdminDto)).rejects.toThrow('Admin with this email already exist');
      // Check the method calls
      expect(mockAdminModel.create).toHaveBeenCalledWith(
        [{ ...createAdminDto, password: hashedPassword }],
        { session: undefined },
      );
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
    });

    // Test failure scenario with other error
    it('should throw an error if any other error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.create.mockRejectedValue(new Error('error'));
      mockTransactionService.withTransaction.mockImplementation(async (cb) => await cb());
      // Call the create method of the AdminService and expect it to throw an error
      await expect(adminService.create(createAdminDto)).rejects.toThrow('error');
      // Check the method calls
      expect(mockAdminModel.create).toHaveBeenCalledWith(
        [{ ...createAdminDto, password: hashedPassword }],
        { session: undefined },
      );
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
    });

    // Test failure scenario with hash password error
    it('should throw an error if the password hashing fails', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.create.mockResolvedValue([returnedAdminDto]);
      mockEmailService.sendAccountCredentials.mockResolvedValue('sent');
      mockPasswordService.generateRandomPassword.mockReturnValue(password);
      mockPasswordService.hashPassword.mockRejectedValue(new Error('error'));
      mockTransactionService.withTransaction.mockImplementation(async (cb) => await cb());
      // Call the create method of the AdminService and expect it to throw an error
      await expect(adminService.create(createAdminDto)).rejects.toThrow('error');
      // Check the method calls
      expect(mockPasswordService.generateRandomPassword).toHaveBeenCalled();
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(password);
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
    });

    // Test failure scenario with generate password error
    it('should throw an error if the password generation fails', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.create.mockResolvedValue([returnedAdminDto]);
      mockEmailService.sendAccountCredentials.mockResolvedValue('sent');
      mockPasswordService.generateRandomPassword.mockImplementation(() => {
        throw new Error('error');
      });
      mockTransactionService.withTransaction.mockImplementation(async (cb) => await cb());
      // Call the create method of the AdminService and expect it to throw an error
      await expect(adminService.create(createAdminDto)).rejects.toThrow('error');
      // Check the method calls
      expect(mockPasswordService.generateRandomPassword).toHaveBeenCalled();
      expect(mockTransactionService.withTransaction).toHaveBeenCalled();
    });
  });


  // Test the findAll method of the AdminService
  describe('findAll', () => {
    // Test success scenario for the findAll method of the AdminService
    it('should return the list of admins', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.find.mockResolvedValue(returnedAdminDto);
      // Call the findAll method of the AdminService
      const result = await adminService.findAll();
      // Check the expected result and the method calls
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminModel.find).toHaveBeenCalledWith();
    });

    // Test failure scenario with error
    it('should throw an error if any error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.find.mockRejectedValue(new Error('error'));
      // Call the findAll method of the AdminService and expect it to throw an error
      await expect(adminService.findAll()).rejects
        .toThrow(new InternalServerErrorException('An Error occurred while Getting the list of admins'));
      // Check the method calls
      expect(mockAdminModel.find).toHaveBeenCalledWith();
    });
  });


  // Test the findOne method of the AdminService
  describe('findOne', () => {
    // Test success scenario for the findOne method of the AdminService
    it('should return the admin details', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockResolvedValue(returnedAdminDto);
      // Call the findOne method of the AdminService
      const result = await adminService.findOne('507f1f77bcf86cd799439011');
      // Check the expected result and the method calls
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    // Test failure scenario with not found error
    it('should throw an error if the admin is not found', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockResolvedValue(null);
      // Call the findOne method of the AdminService and expect it to throw an error
      await expect(adminService.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(new NotFoundException('Admin not found'));
      // Check the method calls
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    // Test failure scenario with error occurred while getting admin details
    it('should throw an error if any error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockRejectedValue(new Error('error'));
      // Call the findOne method of the AdminService and expect it to throw an error
      await expect(adminService.findOne('507f1f77bcf86cd799439011')).rejects
        .toThrow(new InternalServerErrorException('An Error occurred while Getting the admin details'));
      // Check the method calls
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });


  // Test the remove method of the AdminService
  describe('remove', () => {
    // Test success scenario for the remove method of the AdminService
    it('should delete the admin and return success message', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockResolvedValue(returnedAdminDto);
      mockAdminModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
      // Call the remove method of the AdminService
      const result = await adminService.remove('507f1f77bcf86cd799439011');
      // Check the expected result and the method calls
      expect(result).toEqual({ message: 'Successfully deleted admin from records' });
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockAdminModel.deleteOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' }, { session: null });
    });

    // Test failure scenario with not found error
    it('should throw an error if the admin is not found', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockResolvedValue(null);
      // Call the remove method of the AdminService and expect it to throw an error
      await expect(adminService.remove('507f1f77bcf86cd799439011')).rejects.toThrow(new NotFoundException('Admin not found'));
      // Check the method calls
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    // Test failure scenario with owner account error
    it('should throw an error if the owner account is deleted', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockResolvedValue({ ...returnedAdminDto, roles: ['owner'] });
      // Call the remove method of the AdminService and expect it to throw an error
      await expect(adminService.remove('507f1f77bcf86cd799439011')).rejects
      .toThrow(new BadRequestException('You cannot delete the owner account'));
      // Check the method calls
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    // Test failure scenario with error occurred while deleting
    it('should throw an error if any error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findById.mockResolvedValue(returnedAdminDto);
      mockAdminModel.deleteOne.mockRejectedValue(new Error('error'));
      // Call the remove method of the AdminService and expect it to throw an error
      await expect(adminService.remove('507f1f77bcf86cd799439011')).rejects
      .toThrow(new InternalServerErrorException('An Error occurred while delete admin record'));
      // Check the method calls
      expect(mockAdminModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockAdminModel.deleteOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' }, { session: null });
    });
  });


  // Test the findOneByEmail method of the AdminService
  describe('findOneByEmail', () => {
    // Test success scenario for the findOneByEmail method of the AdminService
    it('should return the admin details', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findOne.mockResolvedValue(returnedAdminDto);
      // Call the findOneByEmail method of the AdminService
      const result = await adminService.findOneByEmail(returnedAdminDto.email);
      // Check the expected result and the method calls
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminModel.findOne).toHaveBeenCalledWith({ email: returnedAdminDto.email });
    });

    // Test failure scenario with not found error
    it('should throw an error if the admin is not found', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findOne.mockResolvedValue(null);
      // Call the findOneByEmail method of the AdminService and expect it to throw an error
      await expect(adminService.findOneByEmail(returnedAdminDto.email)).rejects.toThrow(new NotFoundException('Admin not found'));
      // Check the method calls
      expect(mockAdminModel.findOne).toHaveBeenCalledWith({ email: returnedAdminDto.email });
    });

    // Test failure scenario with error occurred while getting admin details
    it('should throw an error if any error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findOne.mockRejectedValue(new Error('error'));
      // Call the findOneByEmail method of the AdminService and expect it to throw an error
      await expect(adminService.findOneByEmail(returnedAdminDto.email)).rejects
      .toThrow(new InternalServerErrorException('An error occurred while finding admin by email'));
      // Check the method calls
      expect(mockAdminModel.findOne).toHaveBeenCalledWith({ email: returnedAdminDto.email });
    });
  });


  // Test the updateWithoutDtoById method of the AdminService
  describe('updateWithoutDtoById', () => {
    // Test success scenario for the updateWithoutDtoById method of the AdminService
    it('should return the updated admin details', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findByIdAndUpdate.mockResolvedValue(returnedAdminDto);
      // Call the updateWithoutDtoById method of the AdminService
      const result = await adminService.updateWithoutDtoById(returnedAdminDto.id, { name: 'Jane Doe' });
      // Check the expected result and the method calls
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledWith(
        returnedAdminDto.id,
        { name: 'Jane Doe' },
        { new: true, session: null },
      );
    });

    // Test failure scenario with not found error
    it('should throw an error if the admin is not found', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findByIdAndUpdate.mockResolvedValue(null);
      // Call the updateWithoutDtoById method of the AdminService and expect it to throw an error
      await expect(adminService.updateWithoutDtoById(returnedAdminDto.id, { name: 'Jane Doe' })).rejects
      .toThrow(new NotFoundException('Admin not found'));
      // Check the method calls
      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledWith(
        returnedAdminDto.id,
        { name: 'Jane Doe' },
        { new: true, session: null },
      );
    });

    // Test failure scenario with error occurred while updating
    it('should throw an error if any error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findByIdAndUpdate.mockRejectedValue(new Error('error'));
      // Call the updateWithoutDtoById method of the AdminService and expect it to throw an error
      await expect(adminService.updateWithoutDtoById(returnedAdminDto.id, { name: 'Jane Doe' })).rejects
      .toThrow(new InternalServerErrorException('An error occurred while updating admin'));
      // Check the method calls
      expect(mockAdminModel.findByIdAndUpdate).toHaveBeenCalledWith(
        returnedAdminDto.id,
        { name: 'Jane Doe' },
        { new: true, session: null },
      );
    });
  });


  // Test the updateWithoutDtoByFields method of the AdminService
  describe('updateWithoutDtoByFields', () => {
    // Test success scenario for the updateWithoutDtoByFields method of the AdminService
    it('should return the updated admin details', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findOneAndUpdate.mockResolvedValue(returnedAdminDto);
      // Call the updateWithoutDtoByFields method of the AdminService
      const result = await adminService.updateWithoutDtoByFields({ email: returnedAdminDto.email }, { name: 'Jane Doe' });
      // Check the expected result and the method calls
      expect(result).toEqual(returnedAdminDto);
      expect(mockAdminModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: returnedAdminDto.email },
        { name: 'Jane Doe' },
        { new: true, session: null },
      );
    });

    // Test failure scenario with not found error
    it('should throw an error if the admin is not found', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findOneAndUpdate.mockResolvedValue(null);
      // Call the updateWithoutDtoByFields method of the AdminService and expect it to throw an error
      await expect(adminService.updateWithoutDtoByFields({ email: returnedAdminDto.email }, { name: 'Jane Doe' })).rejects
      .toThrow(new NotFoundException('Admin not found'));
      // Check the method calls
      expect(mockAdminModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: returnedAdminDto.email },
        { name: 'Jane Doe' },
        { new: true, session: null },
      );
    });

    // Test failure scenario with error occurred while updating
    it('should throw an error if any error occurs', async () => {
      // Mock the required methods with the required return values
      mockAdminModel.findOneAndUpdate.mockRejectedValue(new Error('error'));
      // Call the updateWithoutDtoByFields method of the AdminService and expect it to throw an error
      await expect(adminService.updateWithoutDtoByFields({ email: returnedAdminDto.email }, { name: 'Jane Doe' })).rejects
      .toThrow(new InternalServerErrorException('An error occurred while updating admin'));
      // Check the method calls
      expect(mockAdminModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: returnedAdminDto.email },
        { name: 'Jane Doe' },
        { new: true, session: null },
      );
    });
  });
});
