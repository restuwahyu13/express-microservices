import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

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

  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  access: string[]
}
