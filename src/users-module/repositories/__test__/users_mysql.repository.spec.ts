import { Test, TestingModule } from '@nestjs/testing';
import { UsersMysqlRepository } from '../users_mysql.repository';
import { User } from '../../entities/user';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersMysqlRepository', () => {
  let repository: UsersMysqlRepository;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersMysqlRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UsersMysqlRepository>(UsersMysqlRepository);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('addUser', () => {
    it('should successfully add a user', async () => {
      const fullName = 'Test User';
      const mockUser: User = { id: 1, fullName } as User;

      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await repository.addUser(fullName);

      expect(userRepository.create).toHaveBeenCalledWith({ fullName });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an InternalServerErrorException if adding user fails', async () => {
      const fullName = 'Test User';

      userRepository.create.mockReturnValue(new User());
      userRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(repository.addUser(fullName)).rejects.toThrow(
        new InternalServerErrorException(
          'Error adding user: Error: Database error',
        ),
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [{ id: 1, fullName: 'Test User' }] as User[];

      userRepository.find.mockResolvedValue(mockUsers);

      const result = await repository.getAllUsers();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should throw an InternalServerErrorException if getting users fails', async () => {
      userRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(repository.getAllUsers()).rejects.toThrow(
        new InternalServerErrorException(
          'Error getting all users: Error: Database error',
        ),
      );
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const mockUser: User = { id: 1, fullName: 'Test User' } as User;
      userRepository.find.mockResolvedValue([mockUser]);

      const result = await repository.getUser(1);

      expect(userRepository.find).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await repository.getUser(1);

      expect(userRepository.find).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeNull();
    });

    it('should throw an InternalServerErrorException if getting user by id fails', async () => {
      userRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(repository.getUser(1)).rejects.toThrow(
        new InternalServerErrorException(
          'Error getting a user by id: Error: Database error',
        ),
      );
    });
  });
});
