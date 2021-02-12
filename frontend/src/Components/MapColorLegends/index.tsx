import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';

import MapStyleContainer from '../../stateContainers/mapStyle';
import { extractLayerUnitId, extractMapboxColors } from '../../utils/mapStyle';
import MapColorLegend from './MapColorLegend';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

interface Props {
  visible?: boolean;
}

export default function MapColorLegends({ visible = true }: Props) {
  const classes = useStyles();
  const {
    mapStyle,
    floodingLayer,
    sectorLayer,
  } = MapStyleContainer.useContainer();

  const floodingColors = useMemo(
    () => extractMapboxColors(mapStyle, floodingLayer),
    [mapStyle, floodingLayer],
  );

  const floodingUnitId = useMemo(
    () => extractLayerUnitId(mapStyle, floodingLayer),
    [mapStyle, floodingLayer],
  );

  const sectorColors = useMemo(
    () => extractMapboxColors(mapStyle, sectorLayer),
    [mapStyle, sectorLayer],
  );

  const sectorUnitId = useMemo(
    () => extractLayerUnitId(mapStyle, sectorLayer),
    [mapStyle, sectorLayer],
  );

  if (!visible) {
    return null;
  }

  return (
    <div className={classes.container}>
      {floodingColors && (
        <MapColorLegend
          title="Flooding"
          legend={floodingColors}
          unitId={floodingUnitId}
        />
      )}
      {sectorColors && (
        <MapColorLegend
          title="Sector"
          legend={sectorColors}
          unitId={sectorUnitId}
        />
      )}
    </div>
  );
}
