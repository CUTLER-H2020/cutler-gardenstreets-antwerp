export interface HydrologicalCatchmentInfo {
    area: number;
    benefitsType1: number;
    benefitsType2: number;
    benefitsType3: number;
}

export interface GisRepository {
    geometryCoveredByHydrologicalCatchments(geojson: object): Promise<boolean>;

    getIntersectedHydrologicalCatchmentsInfo(geojson: object): Promise<HydrologicalCatchmentInfo[]>;
}
