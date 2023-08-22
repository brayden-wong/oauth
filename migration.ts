import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({
  path: `./.env`,
});

const main = async () => {
  console.log('running migration...\n');
  const config = {
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  };

  const uri = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;

  console.log(uri);
  const client = new Client({
    connectionString: uri,
  });

  await client.connect();

  const db = drizzle(client);

  await migrate(db, { migrationsFolder: './.drizzle' });
};

main()
  .catch((error) => console.error(error))
  .then(() => console.log('migration complete'))
  .finally(() => process.exit(0));
