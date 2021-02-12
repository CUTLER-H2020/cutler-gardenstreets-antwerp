import MenuItem from '@material-ui/core/MenuItem';
import { navigate } from '@reach/router';
import React from 'react';
import { Geometry } from '@turf/helpers';

import useNotifications from '../../../hooks/useNotifications';
import { useMapViewState } from '../../../stateContainers/mapViewState';
import markersContainer from '../../../stateContainers/markers';
import { Props } from '.';

export default function MarkerMenuItems(props: Props) {
  const { enqueueNotification } = useNotifications();
  const { viewState, setViewState } = useMapViewState();

  const { remove: removeMarker } = markersContainer.useContainer();
  return (
    <>
      <MenuItem
        onClick={() => {
          const featureCoordinates = (props.feature.geometry as Geometry)
            .coordinates;
          const featureLocation = {
            longitude: featureCoordinates[0],
            latitude: featureCoordinates[1],
          };
          setViewState({
            viewState: { ...viewState, ...featureLocation, zoom: 17 },
          });
          navigate('/garden-streets/new');
        }}
      >
        Create Garden Street here
      </MenuItem>
      <MenuItem
        onClick={async () => {
          props.closeContextMenu();
          try {
            const markerId = props.feature.properties?.id as string;
            await removeMarker(markerId);
          } catch (error) {
            enqueueNotification({
              type: 'error',
              message: 'An error occurred while deleting the marker',
            });
          }
        }}
      >
        Delete
      </MenuItem>
    </>
  );
}
