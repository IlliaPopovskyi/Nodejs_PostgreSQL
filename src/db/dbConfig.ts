import { ConnectionOptions } from 'typeorm';

const dbConfig: ConnectionOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'nfrbu2019',
	database: 'learn',
	synchronize: false,
	logging: false,
	migrations: [`${__dirname}/migrations/*.{ts,js}`],
	entities: [`${__dirname}/entities/*.{ts,js}`],
	cli: {
		entitiesDir: `src/db/entities`,
		migrationsDir: `src/db/migrations`,
	},
};

export default dbConfig;
