import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthSignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class AuthSignInDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
