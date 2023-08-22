import { Global, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

const DRIZZLE_CONFIG_TOKEN = 'DRIZZLE_CONFIG_TOKEN';
const DRIZZLE_INJECTION_TOKEN = 'DRIZZLE_INJECTION_TOKEN';

export const getDrizzleConfigToken = () => DRIZZLE_CONFIG_TOKEN;
export const getDrizzleInstanceToken = () => DRIZZLE_INJECTION_TOKEN;
export const InjectDrizzle = () => Inject(DRIZZLE_INJECTION_TOKEN);

export type Database = NodePgDatabase<any>;

type DrizzleConfig = {
  host: string;
  database: string;
  port: number;
  user: string;
  password: string;
};

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: getDrizzleConfigToken(),
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const getDatabaseConfig = async (): Promise<DrizzleConfig> => {
          return {
            host: config.get<string>('POSTGRES_HOST'),
            database: config.get<string>('POSTGRES_DB'),
            port: config.get<number>('POSTGRES_PORT'),
            user: config.get<string>('POSTGRES_USER'),
            password: config.get<string>('POSTGRES_PASSWORD'),
          };
        };

        return await getDatabaseConfig();
      },
    },
    {
      provide: getDrizzleInstanceToken(),
      inject: [getDrizzleConfigToken()],
      useFactory: async ({
        database,
        host,
        password,
        user,
        ...config
      }: DrizzleConfig): Promise<Database> => {
        const uri = `postgres://${user}:${password}@${host}:${config.port}/${database}`;

        const client = new Client({
          connectionString: uri,
        });

        await client.connect();

        const db = drizzle(client, { logger: true, schema });

        return db;
      },
    },
  ],
  exports: [getDrizzleInstanceToken()],
})
export class DrizzleModule {}
