import { Injectable, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DatabaseConfigService implements OnModuleDestroy, OnApplicationShutdown {
  private client: Client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new Client({
      host: this.configService.get('db.db_host'),
      port: this.configService.get<number>('db.db_port'),
      user: this.configService.get('db.db_user'),
      password: this.configService.get('db.db_pass'),
      // database: this.configService.get('DB_NAME'),
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.client.connect();
  }

  async query(text: string, params: any[]) {
    try {
      const res = await this.client.query(text, params);
      return res.rows;
    } catch (err) {
      console.error('Database query error', err);
      throw new Error('Query failed');
    }
  }

  async close() {
    await this.client.end();
    console.log('PostgreSQL client disconnected');
  }

  async onModuleDestroy() {
    await this.close();
  }

  async onApplicationShutdown(signal: string) {
    console.log(`Application shutdown due to signal: ${signal}`);
    await this.close();
  }
}
