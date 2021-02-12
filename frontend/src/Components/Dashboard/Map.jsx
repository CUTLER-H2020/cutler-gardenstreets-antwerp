import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { range } from 'lodash';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DrawPointMode, EditableGeoJsonLayer, ModifyMode } from 'nebula.gl';
import React, { useEffect, useMemo, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import center from '@turf/center';
import { feature, featureCollection, point } from '@turf/helpers';

import { colors, MAP_FILTER } from '../../constants';
import useNotifications from '../../hooks/useNotifications';
import Mapbox from '../../repositories/Mapbox';
import GardenStreetsContainer from '../../stateContainers/gardenStreets';
import { useMapViewState } from '../../stateContainers/mapViewState';
import MapStyleContainer from '../../stateContainers/mapStyle';
import MarkersContainer from '../../stateContainers/markers';
import PinIcon from '../Icons/PinIcon';
import MapColorLegends from '../MapColorLegends';
import { ContextMenu } from './ContextMenu';

const EDIT_MARKERS_NOTIFICATION_KEY = 'edit-markers-message';
const EDIT_MARKERS_NOTIFICATION_MESSAGE =
  'Click on the map to add a marker, move existing marker to change its location';

const useStyles = makeStyles((theme) =>
  createStyles({
    mapContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    markerEnabler: {
      position: 'absolute',
      top: theme.spacing(1),
      left: theme.spacing(1),
      zIndex: 1,
      display: 'flex',
      flexDirection: 'row',
      background: theme.palette.background.paper,
      borderRadius: 4,
    },
    markerEnablerIcon: {
      margin: '8px 0 8px 12px',
    },
    contextMenu: {
      zIndex: 1,
      background: theme.palette.background.paper,
      borderRadius: 4,
    },
  }),
);

const ICON_MAPPING = {
  'cutler-marker-icon': {
    width: 48,
    height: 48,
    x: 0,
    y: 64,
    anchorY: 48,
    mask: true,
  },
  pin: {
    width: 60,
    height: 60,
    x: 64,
    y: 0,
    anchorY: 60,
    mask: true,
  },
};

const HIGHLIGHTED_POLYGON_COLOR = colors.blue;
const ELIGIBLE_POLYGON_COLOR = colors.green;
const NOT_ELIGIBLE_POLYGON_COLOR = colors.red;
const DEFAULT_POLYGON_COLOR = colors.grey;
const POLYGONS_OPACITY = 0.5;
const ICONS_OPACITY = 1;

const MARKERS_COLOR = colors.grey;

const isEligible = (props) => {
  return props.eligibleType1 || props.eligibleType2 || props.eligibleType3;
};

const isNotEligible = (props) => {
  return (
    props.eligibleType1 === false &&
    props.eligibleType2 === false &&
    props.eligibleType3 === false
  );
};

const getGardenStreetColor = (feature, selectedId, opacity) => {
  const props = feature.properties;
  let baseColor;

  if (feature.properties.id === selectedId) {
    baseColor = HIGHLIGHTED_POLYGON_COLOR;
  } else if (isEligible(props)) {
    baseColor = ELIGIBLE_POLYGON_COLOR;
  } else if (isNotEligible(props)) {
    baseColor = NOT_ELIGIBLE_POLYGON_COLOR;
  } else {
    baseColor = DEFAULT_POLYGON_COLOR;
  }

  return [...baseColor, opacity ? opacity * 255 : 255];
};

function Map() {
  const classes = useStyles();

  const { viewState, setViewState, resizeMap } = useMapViewState();

  const [contextMenuInfo, setContextMenuInfo] = useState(null);

  const { enqueueNotification, removeNotification } = useNotifications();

  const [areMarkersEditable, setAreMarkersEditable] = useState(false);

  const {
    mapStyle,
    eligibilityFilter,
    statusFilter,
  } = MapStyleContainer.useContainer();

  const {
    markers,
    create: createMarker,
    update: updateMarker,
  } = MarkersContainer.useContainer();

  const [markersLayerFeatures, setMarkersLayerFeatures] = useState([]);
  useEffect(() => {
    const features = markers.map(({ geometry, ...properties }) =>
      feature(center(geometry).geometry, properties),
    );
    setMarkersLayerFeatures(features);
  }, [markers]);

  const {
    gardenStreets,
    highlightedGardenStreetId,
    selectedGardenStreetId,
  } = GardenStreetsContainer.useContainer();

  const layers = useMemo(() => {
    const filteredGardenStreets = gardenStreets.filter((gardenStreet) => {
      if (
        statusFilter !== MAP_FILTER.STATUS.ALL.value &&
        gardenStreet.status !== statusFilter
      ) {
        return false;
      }
      if (eligibilityFilter === MAP_FILTER.ELIGIBILITY.NOT_ELIGIBLE.value) {
        return isNotEligible(gardenStreet);
      }
      if (eligibilityFilter === MAP_FILTER.ELIGIBILITY.ELIGIBLE.value) {
        return isEligible(gardenStreet);
      }
      return true;
    });

    const polygonsLayerFeatures = filteredGardenStreets.map(
      ({ geometry, ...properties }) => {
        return feature(geometry, properties);
      },
    );

    const iconsLayerFeatures = filteredGardenStreets.map(
      ({ geometry, ...properties }) =>
        feature(center(geometry).geometry, properties),
    );

    const selectedId = selectedGardenStreetId || highlightedGardenStreetId;

    const polygonsLayer = new GeoJsonLayer({
      id: 'garden-streets',
      data: polygonsLayerFeatures,
      lineWidthUnits: 'pixels',
      getLineWidth: 2,
      getLineColor: (feature) => getGardenStreetColor(feature, selectedId),
      getFillColor: (feature) =>
        getGardenStreetColor(feature, selectedId, POLYGONS_OPACITY),
    });

    const iconsLayer = new IconLayer({
      id: 'garden-streets-centers',
      data: iconsLayerFeatures,
      iconAtlas: Mapbox.spriteUrls.png,
      iconMapping: ICON_MAPPING,
      getIcon: () => 'cutler-marker-icon',
      getPosition: (feature) => feature.geometry.coordinates,
      getColor: (feature) =>
        getGardenStreetColor(feature, selectedId, ICONS_OPACITY),
      getSize: (feature) => (feature.properties.id === selectedId ? 72 : 48),
      pickable: true,
      onClick: ({ object, x, y }) => {
        setContextMenuInfo({
          containerStyle: {
            position: 'absolute',
            top: y,
            left: x,
          },
          componentProps: {
            entityType: 'garden-street',
            feature: object,
            closeContextMenu: () => setContextMenuInfo(null),
          },
        });
      },
    });

    const markersIconsLayer = new IconLayer({
      id: 'markers',
      data: markersLayerFeatures,
      iconAtlas: Mapbox.spriteUrls.png,
      iconMapping: ICON_MAPPING,
      getIcon: () => 'pin',
      getPosition: (feature) => feature.geometry.coordinates,
      getColor: MARKERS_COLOR,
      getSize: 48,
      pickable: true,
      onClick: ({ object, x, y }) => {
        if (areMarkersEditable) {
          return;
        }

        setContextMenuInfo({
          containerStyle: {
            position: 'absolute',
            top: y,
            left: x,
          },
          componentProps: {
            entityType: 'marker',
            feature: object,
            closeContextMenu: () => setContextMenuInfo(null),
          },
        });
      },
    });

    const layers = [polygonsLayer, iconsLayer, markersIconsLayer];

    if (areMarkersEditable) {
      const createMarkerLayer = new EditableGeoJsonLayer({
        id: 'new-marker',
        data: featureCollection([]),
        mode: new DrawPointMode(),
        onEdit: (args) => {
          const marker = {
            geometry:
              args.updatedData.features[args.updatedData.features.length - 1]
                .geometry,
          };
          createMarker(marker);
        },
      });

      const editMarkersLayer = new EditableGeoJsonLayer({
        id: 'editable-markers',
        data: featureCollection(markersLayerFeatures),
        mode: new ModifyMode(),
        selectedFeatureIndexes: range(markersLayerFeatures.length),
        onEdit: ({ editType, editContext, updatedData }) => {
          setMarkersLayerFeatures(updatedData.features);
          if (editType === 'finishMovePosition') {
            const { featureIndexes, position } = editContext;
            const index = featureIndexes[0];
            const markerId = markersLayerFeatures[index]?.properties?.id;
            const marker = { geometry: point(position).geometry };
            updateMarker(markerId, marker);
          }
        },
      });

      layers.push(createMarkerLayer, editMarkersLayer);
    }

    return layers;
  }, [
    gardenStreets,
    selectedGardenStreetId,
    highlightedGardenStreetId,
    statusFilter,
    eligibilityFilter,
    areMarkersEditable,
    createMarker,
    updateMarker,
    markersLayerFeatures,
  ]);

  const handleMarkerEnabler = (event) => {
    const editModeActive = event.target.checked;
    setAreMarkersEditable(editModeActive);
    if (editModeActive) {
      enqueueNotification({
        key: EDIT_MARKERS_NOTIFICATION_KEY,
        type: 'info',
        message: EDIT_MARKERS_NOTIFICATION_MESSAGE,
        persist: true,
      });
    } else {
      removeNotification(EDIT_MARKERS_NOTIFICATION_KEY);
    }
  };

  return (
    <Box className={classes.mapContainer}>
      <Card className={classes.markerEnabler}>
        <PinIcon className={classes.markerEnablerIcon} />
        <Switch
          checked={areMarkersEditable}
          onChange={handleMarkerEnabler}
          name="markerEnabler"
          label="Enabling markers"
          inputProps={{ 'aria-label': 'marker checkbox' }}
        />
      </Card>

      <MapColorLegends visible={!selectedGardenStreetId} />

      <DeckGL
        viewState={viewState}
        onViewStateChange={setViewState}
        onResize={resizeMap}
        controller={true}
        layers={layers}
      >
        <StaticMap
          mapboxApiAccessToken={Mapbox.accessToken}
          mapStyle={mapStyle}
        />
      </DeckGL>

      {contextMenuInfo && (
        <div
          className={classes.contextMenu}
          style={contextMenuInfo.containerStyle}
        >
          <ContextMenu {...contextMenuInfo.componentProps} />
        </div>
      )}
    </Box>
  );
}

export default Map;
