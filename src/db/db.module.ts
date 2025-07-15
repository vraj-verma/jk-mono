import { Global, Module } from '@nestjs/common';
import { DatabaseConfigService } from './db.config';

@Global()
@Module({
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {}
