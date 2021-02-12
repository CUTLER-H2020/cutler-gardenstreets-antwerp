import { sumBy } from 'lodash';

import { Tuinstraat } from '../../../frontend/src/models/Tuinstraat';
import { GisRepository } from '../repositories/GisRepository';

export const appendComputedFields = async (
    tuinStraat: Tuinstraat,
    gisRepository: GisRepository,
): Promise<Tuinstraat> => {
    const { geometry } = tuinStraat;
    const isValid = await gisRepository.geometryCoveredByHydrologicalCatchments(geometry);
    if (!isValid) {
        throw new Error('Geometry is not fully covered by hydrological catchments');
    }

    const data = await gisRepository.getIntersectedHydrologicalCatchmentsInfo(geometry);

    const area = sumBy(data, 'area');
    const benefitsType1 = sumBy(data, (el) => el.area * el.benefitsType1);
    const benefitsType2 = sumBy(data, (el) => el.area * el.benefitsType2);
    const benefitsType3 = sumBy(data, (el) => el.area * el.benefitsType3);

    const costsType1 = 25 * area;
    const costsType2 = 40 * area;
    const costsType3 = 50 * area;

    const profitsType1 = benefitsType1 - costsType1;
    const profitsType2 = benefitsType2 - costsType2;
    const profitsType3 = benefitsType3 - costsType3;
    return {
        ...tuinStraat,
        benefitsType1,
        benefitsType2,
        benefitsType3,
        costsType1,
        costsType2,
        costsType3,
        profitsType1,
        profitsType2,
        profitsType3,
        area,
    };
};
