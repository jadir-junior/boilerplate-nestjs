import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRole } from './users-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepositoty: UserRepository,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException(`Passwords don't match`);
    } else {
      return this.userRepositoty.createUser(createUserDto, UserRole.ADMIN);
    }
  }
}
