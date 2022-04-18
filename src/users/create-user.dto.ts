import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Provide an email address',
  })
  @IsEmail(
    {},
    {
      message: 'Provide an email address valid',
    },
  )
  @MaxLength(200, {
    message: 'Email address must be less than 200 characters',
  })
  email: string;

  @IsNotEmpty({
    message: 'Provide an user name',
  })
  @MaxLength(200, {
    message: 'User name must be less than 200 characters',
  })
  name: string;

  @IsNotEmpty({
    message: 'Provide an password',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;

  @IsNotEmpty({
    message: 'Provide an confirmation password',
  })
  @MinLength(6, {
    message: 'Confirmation password must be at least 6 characters long',
  })
  passwordConfirmation: string;
}
