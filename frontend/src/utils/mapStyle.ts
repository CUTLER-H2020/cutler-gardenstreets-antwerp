import find from 'lodash/find';
import { Layer, Style } from 'mapbox-gl';

const getLayer = (mapStyle: Style | null, layerId: string) => {
  const layers: Layer[] = mapStyle?.layers || [];
  const layer = find(layers, (layer) => layer.id === layerId);
  return layer;
};

export const extractMapboxColors = (
  mapStyle: Style | null,
  layerId: string,
) => {
  const layer = getLayer(mapStyle, layerId);
  if (!layer) {
    return;
  }

  // @ts-ignore
  const colors = layer.paint['fill-color'].find(
    (el: any) => Array.isArray(el) && el[0] === 'interpolate',
  );
  if (!colors) {
    return;
  }

  const slicedColors = colors?.slice(3);
  const colorsArr = [];
  for (let i = 0; i < slicedColors.length; i += 2) {
    colorsArr.push({
      value: slicedColors[i],
      color: slicedColors[i + 1],
    });
  }
  return colorsArr;
};

export const extractLayerUnitId = (mapStyle: Style | null, layerId: string) => {
  const layer = getLayer(mapStyle, layerId);
  const unitId = layer?.metadata?.unitId;
  return unitId;
};
