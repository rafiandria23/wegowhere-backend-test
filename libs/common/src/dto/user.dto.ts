import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  MinLength,
} from 'class-validator';

export class UserCreateDto {
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
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly username: string;
}

export class UserFindByIdDto {
  @ApiProperty({
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly user_id: string;
}

export class UserFindByUsernameDto {
  @ApiProperty({
    required: true,
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  readonly username: string;
}
