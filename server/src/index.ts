import { config } from 'dotenv';
config();

import { createApp } from './app';
import { knex } from './db';
import { GisRepository } from './repositories/GisRepository';
import { PostGisRepository } from './repositories/GisRepository/PostGisRepository';
import { CutlerRepository } from './repositories/CutlerRepository';
import { PostgresCutlerRepository } from './repositories/CutlerRepository/PostgresCutlerRepository';

const PORT = 80;
const gisRepository: GisRepository = new PostGisRepository(knex);
const cutlerRepository: CutlerRepository = new PostgresCutlerRepository(knex);
const app = createApp(gisRepository, cutlerRepository);

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
