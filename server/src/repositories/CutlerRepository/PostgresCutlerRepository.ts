import Knex from 'knex';
import { chain, mapKeys } from 'lodash';
import * as wellknown from 'wellknown';

import { CutlerRepository } from '.';
import { Marker, MarkerId } from '../../../../frontend/src/models/Marker';
import { Tuinstraat, TuinstraatId } from '../../../../frontend/src/models/Tuinstraat';

const CUTLER_SCHEMA = 'cutler';
const GARDEN_STREETS_TABLE_NAME = 'garden_streets';
const MARKERS_TABLE_NAME = 'markers';

const modelDbMappings = [
    { modelName: 'eligibleType1', dbName: 'eligible_type_1' },
    { modelName: 'eligibleType2', dbName: 'eligible_type_2' },
    { modelName: 'eligibleType3', dbName: 'eligible_type_3' },
    { modelName: 'benefitsType1', dbName: 'benefits_type_1' },
    { modelName: 'benefitsType2', dbName: 'benefits_type_2' },
    { modelName: 'benefitsType3', dbName: 'benefits_type_3' },
    { modelName: 'costsType1', dbName: 'costs_type_1' },
    { modelName: 'costsType2', dbName: 'costs_type_2' },
    { modelName: 'costsType3', dbName: 'costs_type_3' },
    { modelName: 'profitsType1', dbName: 'profits_type_1' },
    { modelName: 'profitsType2', dbName: 'profits_type_2' },
    { modelName: 'profitsType3', dbName: 'profits_type_3' },
];

const model2Db = chain(modelDbMappings)
    .map((el) => [el.modelName, el.dbName])
    .fromPairs()
    .value();

const db2Model = chain(modelDbMappings)
    .map((el) => [el.dbName, el.modelName])
    .fromPairs()
    .value();

const convertModel2Db = (obj, knex) => {
    const wkt = wellknown.stringify(obj.geometry);
    const geometry = `ST_GeomFromText('${wkt}', 4326)`;
    return {
        ...mapKeys(obj, (_, key) => model2Db[key] || key),
        geometry: knex.raw(geometry),
    };
};

const convertDb2Model = (obj) => ({
    ...mapKeys(obj, (_, key) => db2Model[key] || key),
    geometry: JSON.parse(obj.geometry),
});

export class PostgresCutlerRepository implements CutlerRepository {
    private knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    /**
     * Garden Streets Methods
     * @param tuinstraat
     */

    async createGardenStreet(tuinstraat: Tuinstraat): Promise<Tuinstraat> {
        const gardenStreetDb = convertModel2Db(tuinstraat, this.knex);
        const res = await this.knex(GARDEN_STREETS_TABLE_NAME)
            .withSchema(CUTLER_SCHEMA)
            .insert(gardenStreetDb)
            .returning(this.getSelectionFields());
        const gardenStreet = convertDb2Model(res[0]);
        return gardenStreet;
    }

    async getAllGardenStreets(): Promise<Array<Tuinstraat>> {
        const res = await this.knex(GARDEN_STREETS_TABLE_NAME)
            .withSchema(CUTLER_SCHEMA)
            .select(...this.getSelectionFields());
        const gardenStreets = res.map(convertDb2Model);
        return gardenStreets;
    }

    async updateGardenStreet(id: TuinstraatId, tuinstraat: Tuinstraat): Promise<Tuinstraat | null> {
        const gardenStreetDb = convertModel2Db(tuinstraat, this.knex);
        const res = await this.knex(GARDEN_STREETS_TABLE_NAME)
            .withSchema(CUTLER_SCHEMA)
            .update(gardenStreetDb)
            .where({ id })
            .returning(this.getSelectionFields());
        if (res.length === 0) {
            return null;
        }
        const gardenStreet = convertDb2Model(res[0]);
        return gardenStreet;
    }

    async deleteGardenStreet(id: TuinstraatId): Promise<void> {
        await this.knex(GARDEN_STREETS_TABLE_NAME).withSchema(CUTLER_SCHEMA).del().where({ id });
    }

    async existsGardenStreet(id: TuinstraatId): Promise<boolean> {
        const res = await this.knex(GARDEN_STREETS_TABLE_NAME).withSchema(CUTLER_SCHEMA).select('id').where({ id });
        return res.length > 0;
    }

    /**
     * Marker Methods
     * @param marker
     */

    async createMarker(marker: Marker): Promise<Marker> {
        const markerDB = convertModel2Db(marker, this.knex);
        const res = await this.knex(MARKERS_TABLE_NAME)
            .withSchema(CUTLER_SCHEMA)
            .insert(markerDB)
            .returning(this.getSelectionFields());
        return res[0];
    }

    async getAllMarkers(): Promise<Array<Marker>> {
        const res = await this.knex(MARKERS_TABLE_NAME)
            .withSchema(CUTLER_SCHEMA)
            .select(...this.getSelectionFields());
        const markers = res.map(convertDb2Model);
        return markers;
    }

    async updateMarker(id: MarkerId, marker: Marker): Promise<Marker | null> {
        const markerDB = convertModel2Db(marker, this.knex);
        const res = await this.knex(MARKERS_TABLE_NAME)
            .withSchema(CUTLER_SCHEMA)
            .update(markerDB)
            .where({ id })
            .returning(this.getSelectionFields());
        if (res.length === 0) {
            return null;
        }
        return res[0];
    }

    async deleteMarker(id: MarkerId): Promise<void> {
        await this.knex(MARKERS_TABLE_NAME).withSchema(CUTLER_SCHEMA).del().where({ id });
    }

    async existsMarker(id: MarkerId): Promise<boolean> {
        const res = await this.knex(MARKERS_TABLE_NAME).withSchema(CUTLER_SCHEMA).select('id').where({ id });
        return res.length > 0;
    }

    private getSelectionFields() {
        // FIXME: as string[] is not correct but without it tsc doesn't compile, yet it works as expected
        return ['*', this.knex.raw('ST_AsGeoJSON(geometry) as geometry')] as string[];
    }
}
