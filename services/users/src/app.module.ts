import { Container, Injectable, Module } from '@node/pkg'
import { Router } from 'express'

import { UsersModule } from '@modules/module.users'

@Module([
	{
		token: 'UsersModule',
		useFactory: (): Router => {
			return Container.resolve(UsersModule).route.main()
		}
	}
])
@Injectable()
export class AppModule {}
