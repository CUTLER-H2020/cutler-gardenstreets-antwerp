import Knex from 'knex';

import { getEnvValue } from './helpers/getEnvValue';

export const knex = Knex({
    client: 'pg',
    connection: {
        host: getEnvValue('PGHOST'),
        port: parseInt(getEnvValue('PGPORT'), 10),
        database: getEnvValue('PGDATABASE'),
        user: getEnvValue('PGUSER'),
        password: getEnvValue('PGPASSWORD'),
        ssl: true,
    },
});
