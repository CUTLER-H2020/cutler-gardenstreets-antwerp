-- some of the geometries were invalid. This script fixes that
-- by fixing the geometries one by one, after manual inspection
-- of what the issue was

UPDATE cutler.hydrological_catchments
SET geom = ST_MakeValid(geom)
WHERE gid = '57'
;

UPDATE cutler.hydrological_catchments
SET geom = ST_GeometryN(ST_MakeValid(geom), 1)
WHERE gid = '38'
;