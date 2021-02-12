import { FlyToInterpolator } from 'deck.gl';
import { navigate } from '@reach/router';
import { useCallback } from 'react';
import { feature, featureCollection } from '@turf/helpers';

import useNotifications from '../hooks/useNotifications';
import GardenStreetContainer from '../stateContainers/gardenStreets';
import { useMapViewState } from '../stateContainers/mapViewState';
import { useModals } from '../stateContainers/modals';

export default function useGardenStreetActions() {
  const {
    gardenStreets,
    remove: removeGardenStreet,
    setHighlightedGardenStreetId,
    setSelectedGardenStreetId,
  } = GardenStreetContainer.useContainer();

  const { flyTo, resetMapDimensions } = useMapViewState();
  const { openModal } = useModals();
  const { enqueueNotification } = useNotifications();

  const selectGardenStreet = useCallback(
    (id: string) => {
      const gardenStreet = gardenStreets.find((el) => el.id === id);
      if (gardenStreet) {
        setSelectedGardenStreetId(id);
        if (flyTo) {
          const f = feature(gardenStreet.geometry);
          const fc = featureCollection([f]);
          const transitionOptions = {
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 'auto',
          };
          flyTo(fc, transitionOptions);
        }
      }
    },
    [gardenStreets, setSelectedGardenStreetId, flyTo],
  );

  const editGardenStreet = useCallback(
    (id: string) => {
      resetMapDimensions();
      navigate(`/garden-streets/edit/${id}`);
      setHighlightedGardenStreetId('');
      setSelectedGardenStreetId('');
    },
    [
      resetMapDimensions,
      setHighlightedGardenStreetId,
      setSelectedGardenStreetId,
    ],
  );

  const deleteGardenStreet = useCallback(
    (id: string) => {
      setHighlightedGardenStreetId('');
      setSelectedGardenStreetId('');
      openModal({
        id: 'delete-garden-street',
        title: 'Delete garden street',
        content: 'Are you sure ? This action is undoable',
        cancel: {
          label: 'Cancel',
          handler: () => {},
        },
        commit: {
          label: 'Delete',
          handler: async () => {
            try {
              await removeGardenStreet(id);
            } catch (error) {
              enqueueNotification({
                type: 'error',
                message: error.message,
              });
            }
          },
        },
      });
    },
    [
      setHighlightedGardenStreetId,
      setSelectedGardenStreetId,
      openModal,
      removeGardenStreet,
      enqueueNotification,
    ],
  );

  return {
    deleteGardenStreet,
    editGardenStreet,
    selectGardenStreet,
  };
}
