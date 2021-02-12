-- determine if garden street is completely covered by hydrological catchments
CREATE FUNCTION geometry_covered_by_hydrological_catchments(text) RETURNS boolean AS $$
DECLARE
	geojson ALIAS FOR $1;
	geometry geometry;
	res boolean;
BEGIN
	geometry := ST_SetSRID(ST_GeomFromGeoJSON(geojson), 4326);

	SELECT ST_CoveredBy(geometry, ST_Union(HC.geom)) INTO res
	FROM cutler.hydrological_catchments HC;
	
	RETURN res;
END;
$$ LANGUAGE PLPGSQL
;

-- retrieve the necessary information to compute the benefits
CREATE FUNCTION get_intersected_hydrological_catchments_info(text)
RETURNS TABLE (
    area float,
    benefits_1 integer,
    benefits_2 integer,
    benefits_3 integer
) AS $$
DECLARE
    geojson ALIAS FOR $1;
    geometry geometry;
BEGIN
    geometry := ST_SetSRID(ST_GeomFromGeoJSON(geojson), 4326);

    RETURN QUERY SELECT
        ST_Area(ST_Intersection(geometry, HC.geom)::geography) as area,
        HC.benefits_1,
        HC.benefits_2,
        HC.benefits_3
    FROM cutler.hydrological_catchments HC
    WHERE ST_Area(ST_Intersection(geometry, HC.geom)::geography) > 0;
END;
$$ LANGUAGE PLPGSQL
;
