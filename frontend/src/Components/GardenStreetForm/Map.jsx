import DeckGL from '@deck.gl/react';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DrawPolygonMode, EditableGeoJsonLayer, ModifyMode } from 'nebula.gl';
import React, { useEffect, useMemo, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { feature, featureCollection } from '@turf/helpers';

import { colors } from '../../constants';
import Mapbox from '../../repositories/Mapbox';
import { useMapViewState } from '../../stateContainers/mapViewState';
import MapStyleContainer from '../../stateContainers/mapStyle';
import MapColorLegends from '../MapColorLegends';

const INITIAL_DRAW_COLOR = colors.black;
const MODIFY_COLOR = colors.blue;
const FILL_OPACITY = 0.5;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
  }),
);

function Map({ mode, geometry, updateGeometry }) {
  const initialDraw = geometry === null;

  const classes = useStyles();

  const myFeatureCollection = useMemo(
    () => featureCollection(initialDraw ? [] : [feature(geometry)]),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geometry],
  );

  const { viewState, setViewState, resizeMap, flyTo } = useMapViewState();

  const [hasFlown, setHasFlown] = useState(false);

  useEffect(
    () => {
      if (mode === 'edit' && flyTo && !hasFlown) {
        flyTo(myFeatureCollection);
        setHasFlown(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flyTo],
  );

  const { mapStyle } = MapStyleContainer.useContainer();

  const layers = useMemo(
    () => {
      const layer = new EditableGeoJsonLayer({
        id: 'polygon',
        data: myFeatureCollection,
        mode: initialDraw ? new DrawPolygonMode() : new ModifyMode(),
        selectedFeatureIndexes: initialDraw ? [] : [0],
        onEdit: (args) => {
          const featureCollection = args.updatedData;
          const feature = featureCollection.features[0];
          if (feature) {
            updateGeometry(feature.geometry);
          }
        },
        getEditHandlePointColor: initialDraw
          ? INITIAL_DRAW_COLOR
          : MODIFY_COLOR,
        _subLayerProps: {
          geojson: {
            getFillColor: [...MODIFY_COLOR, 255 * FILL_OPACITY],
            getLineColor: MODIFY_COLOR,
          },
          guides: {
            getFillColor: [...INITIAL_DRAW_COLOR, 255 * FILL_OPACITY],
            getLineColor: INITIAL_DRAW_COLOR,
          },
        },
      });

      return [layer];
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myFeatureCollection],
  );

  return (
    <Box className={classes.container}>
      <MapColorLegends />

      <DeckGL
        viewState={viewState}
        onViewStateChange={setViewState}
        onResize={resizeMap}
        controller={{ doubleClickZoom: false }}
        layers={layers}
      >
        <StaticMap
          mapboxApiAccessToken={Mapbox.accessToken}
          mapStyle={mapStyle}
        />
      </DeckGL>
    </Box>
  );
}

export default Map;
