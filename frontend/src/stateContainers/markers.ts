import { useCallback, useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

import useNotifications from '../hooks/useNotifications';
import { Marker, MarkerId } from '../models/Marker';
import CutlerRepository from '../repositories/Cutler';

interface State {
  loading: boolean;
  markers: Marker[];
}

const initialState: State = {
  loading: false,
  markers: [],
};

function useMarkers() {
  const { enqueueNotification } = useNotifications();

  const [state, setState] = useState<State>(initialState);

  const refresh = useCallback(async () => {
    setState((state) => ({ ...state, loading: true }));
    try {
      const updatedMarkers = await CutlerRepository.getAllMarkers();
      setState((state) => ({
        ...state,
        loading: false,
        markers: updatedMarkers,
      }));
    } catch (error) {
      enqueueNotification({ type: 'error', message: error.message });
      setState((state) => ({
        ...state,
        loading: false,
      }));
    }
  }, [enqueueNotification]);

  const create = useCallback(
    async (marker: Marker) => {
      await CutlerRepository.createMarker(marker);
      await refresh();
    },
    [refresh],
  );

  const update = useCallback(
    async (id: MarkerId, marker: Marker) => {
      await CutlerRepository.updateMarker(id, marker);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: MarkerId) => {
      await CutlerRepository.deleteMarker(id);
      await refresh();
    },
    [refresh],
  );

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: state.loading,
    markers: state.markers,
    create,
    update,
    remove,
  };
}

const container = createContainer(useMarkers);

export default container;
