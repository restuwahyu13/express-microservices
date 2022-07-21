import { Container, Injectable, Module } from '@node/pkg'
import { Router } from 'express'

import { RolesModule } from '@/modules/module.roles'

@Module([
  {
    token: 'RolesModule',
    useFactory: (): Router => {
      return Container.resolve(RolesModule).route.main()
    }
  }
])
@Injectable()
export class AppModule {}
