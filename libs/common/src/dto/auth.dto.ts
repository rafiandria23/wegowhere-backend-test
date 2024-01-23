import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthSignUpDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly last_name: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    required: true,
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class AuthSignInDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    required: true,
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
