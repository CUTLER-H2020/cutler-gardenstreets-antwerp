import { useCallback, useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

import useNotifications from '../hooks/useNotifications';
import {
  FormGardenStreet,
  TuinstraatId,
  Tuinstraat,
} from '../models/Tuinstraat';
import CutlerRepository from '../repositories/Cutler';

interface State {
  loading: boolean;
  gardenStreets: Tuinstraat[];
  highlightedGardenStreetId: string;
}

const initialState: State = {
  loading: false,
  gardenStreets: [],
  highlightedGardenStreetId: '',
};

function useGardenStreets() {
  const { enqueueNotification } = useNotifications();

  // by grouping state into a single object we avoid unnecessary rerenders
  // that we were having with multiple useState
  const [state, setState] = useState(initialState);
  const [selectedGardenStreetId, setSelectedGardenStreetId] = useState('');

  const refresh = useCallback(async () => {
    setState((state) => ({ ...state, loading: true }));
    try {
      const updatedGardenStreets = await CutlerRepository.getAllGardenStreets();
      setState((state) => ({
        ...state,
        loading: false,
        gardenStreets: updatedGardenStreets,
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
    async (gardenStreet: FormGardenStreet) => {
      await CutlerRepository.createGardenStreet(gardenStreet);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id: TuinstraatId, gardenStreet: FormGardenStreet) => {
      await CutlerRepository.updateGardenStreet(id, gardenStreet);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: TuinstraatId) => {
      await CutlerRepository.deleteGardenStreet(id);
      await refresh();
    },
    [refresh]
  );

  const setHighlightedGardenStreetId = useCallback(
    (id: string) =>
      setState((state) => ({ ...state, highlightedGardenStreetId: id })),
    []
  );

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: state.loading,
    gardenStreets: state.gardenStreets,
    highlightedGardenStreetId: state.highlightedGardenStreetId,
    create,
    update,
    remove,
    setHighlightedGardenStreetId,
    selectedGardenStreetId,
    setSelectedGardenStreetId,
  };
}

const container = createContainer(useGardenStreets);

export default container;
