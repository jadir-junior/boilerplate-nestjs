import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

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

  password: string;

  passwordConfirmation: string;
}
