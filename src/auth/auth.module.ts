import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Utility } from '../helpers/utils';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AccountsModule, UsersModule],
  controllers: [AuthController],
  providers: [Utility],
})
export class AuthModule { }
