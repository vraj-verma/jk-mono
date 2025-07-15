import { Module } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { AWSModule } from '../aws/aws.module';
import { UsersModule } from '../users/users.module';
import { Utility } from '../helpers/utils';

@Module({
  imports: [AWSModule, UsersModule],
  controllers: [DocsController],
  providers: [Utility, DocsService],
})
export class DocsModule { }
