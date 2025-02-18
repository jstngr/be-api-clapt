import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project', description: 'Name of the project' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'A description of my project', 
    description: 'Description of the project',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: 'owner@example.com', 
    description: 'Email of the project owner'
  })
  @IsString()
  @IsNotEmpty()
  ownerEmail: string;
}
