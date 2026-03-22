import { Module } from '@nestjs/common'
import { UserResolver } from './resolvers/user.resolver'
import { ApplicationModule } from '@/modules/user/application/application.module'

@Module({
  imports: [ApplicationModule],
  controllers: [],
  providers: [UserResolver],
  exports: [],
})
export class InfrastructureModule {}
