import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AWSModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DocsModule } from './docs/docs.module';
import { DatabaseModule } from './db/db.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // load: [() => require('../config.json')],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '5d' },
    }),
    AWSModule,
    AuthModule,
    UsersModule,
    DocsModule,
    DatabaseModule,
    AccountsModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
