import * as firebaseAdmin from 'firebase-admin';
import Router from 'koa-router';

import { appendComputedFields } from './helpers/appendComputedFields';
import { GisRepository } from './repositories/GisRepository';
import { CutlerRepository } from './repositories/CutlerRepository';
import { TuinstraatId, Tuinstraat } from '../../frontend/src/models/Tuinstraat';
import { Marker, MarkerId } from '../../frontend/src/models/Marker';

export const createRouter = (
    koaRouterOptions: any,
    gisRepository: GisRepository,
    cutlerRepository: CutlerRepository,
    firebaseApp: firebaseAdmin.app.App,
) => {
    const router = new Router(koaRouterOptions);

    router.use(async (ctx: any, next) => {
        const idToken = ctx.request.token;
        if (!idToken) {
            ctx.status = 400;
            ctx.body = 'No Authorization Bearer token provided';
            return;
        }

        try {
            await firebaseApp.auth().verifyIdToken(idToken);
            await next();
        } catch (error) {
            ctx.status = 401;
        }
    });

    /**
     * Garden Streets routes
     */
    // TODO: input validation
    router.post('/gardenstreets', async (ctx) => {
        const inputGardenStreet: Tuinstraat = ctx.request.body;
        const completeGardenStreet = await appendComputedFields(inputGardenStreet, gisRepository);
        const createdGardenStreet = await cutlerRepository.createGardenStreet(completeGardenStreet);
        ctx.status = 201;
        ctx.body = createdGardenStreet;
    });

    router.get('/gardenstreets', async (ctx) => {
        ctx.status = 200;
        ctx.body = await cutlerRepository.getAllGardenStreets();
    });

    // TODO: input validation
    router.put('/gardenstreets/:id', async (ctx) => {
        const id: TuinstraatId = ctx.params.id;
        const gardenStreetExists = await cutlerRepository.existsGardenStreet(id);
        if (!gardenStreetExists) {
            ctx.status = 404;
        } else {
            const inputGardenStreet: Tuinstraat = ctx.request.body;
            const completeGardenStreet = await appendComputedFields({ ...inputGardenStreet, id }, gisRepository);
            const updatedGardenStreet = await cutlerRepository.updateGardenStreet(id, completeGardenStreet);
            ctx.status = 200;
            ctx.body = updatedGardenStreet;
        }
    });

    router.delete('/gardenstreets/:id', async (ctx) => {
        const id: TuinstraatId = ctx.params.id;
        await cutlerRepository.deleteGardenStreet(id);
        ctx.status = 200;
    });

    /**
     * Markers routes
     */

    router.post('/markers', async (ctx) => {
        const marker: Marker = ctx.request.body;
        const createMarker = await cutlerRepository.createMarker(marker);
        ctx.status = 201;
        ctx.body = createMarker;
    });

    router.get('/markers', async (ctx) => {
        ctx.status = 200;
        ctx.body = await cutlerRepository.getAllMarkers();
    });

    router.put('/markers/:id', async (ctx) => {
        const id: MarkerId = ctx.params.id;
        const markerExists = await cutlerRepository.existsMarker(id);
        if (!markerExists) {
            ctx.status = 404;
        } else {
            const marker: Marker = ctx.request.body;
            const updateMarker = await cutlerRepository.updateMarker(id, marker);
            ctx.status = 200;
            ctx.body = updateMarker;
        }
    });

    router.delete('/markers/:id', async (ctx) => {
        const id: MarkerId = ctx.params.id;
        await cutlerRepository.deleteMarker(id);
        ctx.status = 200;
    });

    return router;
};
