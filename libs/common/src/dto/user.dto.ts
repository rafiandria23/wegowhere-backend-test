import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @IsOptional()
  readonly last_name: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;
}

export class UserFindByIdDto {
  @IsString()
  @IsNotEmpty()
  readonly user_id: string;
}

export class UserFindByUsernameDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;
}
