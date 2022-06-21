/* eslint-disable import/no-unresolved */
import { createConnection } from 'typeorm';

import dbconfig from './dbconfig';

export default () => {
	createConnection(dbconfig)
		.then(async connection => {
			await connection.runMigrations({ transaction: 'all' });
			console.log('Db connected');
		})
		.catch(err => {
			console.log(err);
		});
};
