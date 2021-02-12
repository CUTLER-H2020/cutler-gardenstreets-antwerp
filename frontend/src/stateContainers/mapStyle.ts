import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import { findKey } from 'lodash';
import { Style, Layer } from 'mapbox-gl';
import { MAP_FILTER } from '../constants';

import { mapLayersUnitId } from '../config';
import Mapbox from '../repositories/Mapbox';

/**
 * Interfaces
 */
interface Group {
  name: string;
}

interface Groups {
  [key: string]: Group;
}

interface ICheckboxes {
  [key: string]: boolean;
}

const FLOODING_RISK = 'Cutler Flooding Risk';
const SECTOR = 'Cutler Sector';
const ENVIRONMENTAL = 'Cutler Environmental Information';

const findLayers = (
  layers: Layer[] | undefined,
  groups: Groups,
  groupName: string,
) => {
  const groupKey = findKey(groups, (group) => {
    return group.name === groupName;
  });
  const foundLayers = layers
    ? layers.filter(
        (layer: Layer) => layer.metadata['mapbox:group'] === groupKey,
      )
    : [];
  return foundLayers;
};

// this mutates the map style
const addLayerUnits = (mapStyle: Style) => {
  const layers = mapStyle.layers || [];
  layers.forEach((layer) => {
    const layerId = layer.id;
    // @ts-ignore
    const unitId = mapLayersUnitId[layerId];
    if (unitId) {
      const metadata = layer.metadata || {};
      metadata.unitId = unitId;
    }
  });
};

function useMap() {
  const [mapStyle, setMapStyle] = useState<Style | null>(null);
  const [isMapStyleReady, setIsMapStyleReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [floodingLayer, setFloodingLayer] = useState<string>('');
  const [sectorLayer, setSectorLayer] = useState<string>('');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>(
    MAP_FILTER.ELIGIBILITY.ALL.value,
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    MAP_FILTER.STATUS.ALL.value,
  );
  const [environmentLayer, setEnvironmentLayer] = useState<ICheckboxes>({});

  const layers = mapStyle?.layers;
  const groups: Groups = mapStyle?.metadata['mapbox:groups'];

  const floodingRiskLayers = findLayers(layers, groups, FLOODING_RISK);
  const sectorLayers = findLayers(layers, groups, SECTOR);
  const environmentLayers = findLayers(layers, groups, ENVIRONMENTAL);

  useEffect(() => {
    const init = async () => {
      const mapStyle = await Mapbox.fetchStyle();
      if (mapStyle) {
        addLayerUnits(mapStyle);
        setMapStyle(mapStyle);
      } else {
        setError('Could not fetch map style');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (mapStyle && !isMapStyleReady) {
      const layers = mapStyle!.layers;
      const floodingRiskLayers = findLayers(layers, groups, FLOODING_RISK);
      const sectorLayers = findLayers(layers, groups, SECTOR);
      const environmentLayers = findLayers(layers, groups, ENVIRONMENTAL);
      if (floodingRiskLayers.length > 0) {
        setFloodingLayer(floodingRiskLayers[0].id);
      }
      if (sectorLayers.length > 0) {
        setSectorLayer(sectorLayers[0].id);
      }
      if (environmentLayers.length > 0) {
        setEnvironmentLayer({ [environmentLayers[0].id]: true });
      }
      setIsMapStyleReady(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle, isMapStyleReady]);

  useEffect(() => {
    if (Array.isArray(layers)) {
      const floodingGroupKey = floodingRiskLayers[0].metadata['mapbox:group'];
      const newLayers = layers.map((a) => {
        if (
          a.id === floodingLayer &&
          a.metadata['mapbox:group'] === floodingGroupKey
        ) {
          a.layout!.visibility = 'visible';
          return a;
        } else if (a.metadata['mapbox:group'] === floodingGroupKey) {
          a.layout!.visibility = 'none';
          return a;
        } else {
          return a;
        }
      });
      setMapStyle({ ...mapStyle!, layers: newLayers });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floodingLayer]);

  useEffect(() => {
    if (Array.isArray(layers)) {
      const sectorGroupKey = sectorLayers[0].metadata['mapbox:group'];
      const newLayers = layers!.map((a) => {
        if (
          a.id === sectorLayer &&
          a.metadata['mapbox:group'] === sectorGroupKey
        ) {
          a.layout!.visibility = 'visible';
          return a;
        } else if (a.metadata['mapbox:group'] === sectorGroupKey) {
          a.layout!.visibility = 'none';
          return a;
        } else {
          return a;
        }
      });

      setMapStyle({ ...mapStyle!, layers: newLayers });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorLayer]);

  useEffect(() => {
    if (Array.isArray(layers)) {
      const envGroupKey = environmentLayers[0].metadata['mapbox:group'];

      const activeLayers = Object.keys(environmentLayer).filter(
        (l) => environmentLayer[l],
      );

      const newLayers = layers!.map((a) => {
        if (
          activeLayers.includes(a.id) &&
          a.metadata['mapbox:group'] === envGroupKey
        ) {
          a.layout!.visibility = 'visible';
          return a;
        } else if (a.metadata['mapbox:group'] === envGroupKey) {
          a.layout!.visibility = 'none';
          return a;
        } else {
          return a;
        }
      });
      setMapStyle({ ...mapStyle!, layers: newLayers });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentLayer]);

  return {
    error,
    isMapStyleReady,
    mapStyle,
    floodingLayer,
    sectorLayer,
    environmentLayer,
    setSectorLayer,
    setFloodingLayer,
    setEnvironmentLayer,
    floodingRiskLayers,
    sectorLayers,
    environmentLayers,
    eligibilityFilter,
    setEligibilityFilter,
    statusFilter,
    setStatusFilter,
  };
}

const container = createContainer(useMap);

export default container;
