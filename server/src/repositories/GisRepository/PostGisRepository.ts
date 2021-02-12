import Knex from 'knex';

import { GisRepository, HydrologicalCatchmentInfo } from '.';

interface HydrologicalCatchmentInfoDb {
    area: number;
    benefits_1: number;
    benefits_2: number;
    benefits_3: number;
}

const convertDb2Model = (el: HydrologicalCatchmentInfoDb): HydrologicalCatchmentInfo => ({
    area: el.area,
    benefitsType1: el.benefits_1,
    benefitsType2: el.benefits_2,
    benefitsType3: el.benefits_3,
});

export class PostGisRepository implements GisRepository {
    private knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async geometryCoveredByHydrologicalCatchments(geojson: object) {
        const funcName = 'geometry_covered_by_hydrological_catchments';
        const res = await this.knex.raw(`SELECT ${funcName} as result FROM ${funcName}('${JSON.stringify(geojson)}')`);
        const result: boolean = res.rows[0].result;
        return result;
    }

    async getIntersectedHydrologicalCatchmentsInfo(geojson: object) {
        const res = await this.knex.raw(
            `SELECT * FROM get_intersected_hydrological_catchments_info('${JSON.stringify(geojson)}')`,
        );
        const rows: HydrologicalCatchmentInfoDb[] = res.rows;
        return rows.map(convertDb2Model);
    }
}
