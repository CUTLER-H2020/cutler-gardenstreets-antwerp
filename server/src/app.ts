import * as firebaseAdmin from 'firebase-admin';
import Koa from 'koa';
import bearerToken from 'koa-bearer-token';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import serve from 'koa-static';
import * as path from 'path';

import { getEnvValue } from './helpers/getEnvValue';
import { GisRepository } from './repositories/GisRepository';
import { CutlerRepository } from './repositories/CutlerRepository';
import { createRouter } from './router';

const API_PREFIX = '/api';

export const createApp = (gisRepository: GisRepository, cutlerRepository: CutlerRepository) => {
    const app = new Koa();

    const firebaseApp = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            projectId: getEnvValue('FIREBASE_SERVICE_ACCOUNT_PROJECT_ID'),
            privateKey: getEnvValue('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
            clientEmail: getEnvValue('FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL'),
        }),
    });

    const router = createRouter({ prefix: API_PREFIX }, gisRepository, cutlerRepository, firebaseApp);

    app.use(bodyParser());
    app.use(bearerToken());
    app.use(router.routes());

    if (process.env.NODE_ENV === 'production') {
        const reactAppBuildPath = path.resolve(process.env.PWD, '../frontend/build');
        app.use(serve(reactAppBuildPath));

        app.use(async (ctx) => {
            const isApiCall = ctx.request.url.startsWith(API_PREFIX);
            const isHtmlRequest = ctx.request.headers['accept'].includes('text/html');
            if (!isApiCall && isHtmlRequest && ctx.status === 404) {
                await send(ctx, 'index.html', { root: reactAppBuildPath });
            }
        });
    }

    return app;
};
