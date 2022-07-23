import { IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class DTORolesId {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class DTORoles {
  @IsOptional()
  @IsMongoId()
  id?: string

  @IsNotEmpty()
  @IsString()
  name: string
}

export class DTORolePagination {
  @IsOptional()
  @IsNumber()
  limit: number

  @IsOptional()
  @IsEmail()
  offset: number

  @IsOptional()
  @IsString()
  sort: any

  @IsOptional()
  @IsBoolean()
  filter: boolean
}
