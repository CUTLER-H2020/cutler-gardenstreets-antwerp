import { WebMercatorViewport } from '@deck.gl/core';
import computeBbox from '@turf/bbox';

export const computeIdealViewStateForBbox = ({ mapDimensions, bbox }) => {
  if (mapDimensions === null) {
    throw new Error('The mapDimensions prop is null');
  }

  const viewport = new WebMercatorViewport(mapDimensions);
  const geometryBbox = [
    [bbox.minLon, bbox.minLat],
    [bbox.maxLon, bbox.maxLat],
  ];
  const idealViewState = viewport.fitBounds(geometryBbox, { padding: 16 });
  return idealViewState;
};

export const computeIdealViewstateForFeatureCollection = ({
  mapDimensions,
  featureCollection,
}) => {
  if (featureCollection?.type !== 'FeatureCollection') {
    throw new Error('The featureCollection prop is not a FeatureCollection');
  }

  const nFeatures = featureCollection.features.length;
  if (nFeatures === 0) {
    throw new Error('The feature collection is empty');
  }

  const [minLon, minLat, maxLon, maxLat] = computeBbox(featureCollection);
  const bbox = { minLon, minLat, maxLon, maxLat };
  return computeIdealViewStateForBbox({ mapDimensions, bbox });
};
