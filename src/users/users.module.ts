import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Utility } from '../helpers/utils';

@Module({
  controllers: [UsersController],
  providers: [Utility, UsersService],
  exports: [UsersService],
})
export class UsersModule { }  
