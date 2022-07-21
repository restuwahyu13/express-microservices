import { IsBoolean, IsEmail, IsJWT, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'

export class DTORegister {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string

  @IsNotEmpty()
  @IsMongoId()
  roleId: string
}

export class DTOLogin {
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string
}

export class DTOUsersId {
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

export class DTOUsers {
  @IsOptional()
  @IsMongoId()
  id?: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string

  @IsOptional()
  @IsBoolean()
  active?: boolean

  @IsNotEmpty()
  @IsMongoId()
  roleId: string
}

export class DTORefreshToken {
  @IsNotEmpty()
  @IsJWT()
  accessToken: string
}

export class DTOHealthToken {
  @IsNotEmpty()
  @IsMongoId()
  id: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  role: string
}

export class DTORevokeToken {
  @IsNotEmpty()
  @IsMongoId()
  id: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  role: string
}
