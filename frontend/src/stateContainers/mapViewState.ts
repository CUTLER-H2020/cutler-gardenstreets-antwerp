import { useState } from 'react';
import { createContainer } from 'unstated-next';

import { ANTWERP_BBOX } from '../constants';
import {
  computeIdealViewStateForBbox,
  computeIdealViewstateForFeatureCollection,
} from '../utils/map';

// TODO: use Deck.gl proper ViewState type
type ViewState = object;

interface MapDimensions {
  width: number;
  height: number;
}

interface State {
  mapDimensions: MapDimensions | null;
  viewState: ViewState;
}

const INITIAL_VIEW_STATE: ViewState = {
  latitude: 0,
  longitude: 0,
  zoom: 0,
};

function useMapViewStateHook(initialViewState?: ViewState) {
  const [state, setState] = useState<State>({
    mapDimensions: null,
    viewState: initialViewState || INITIAL_VIEW_STATE,
  });

  const setViewState = ({ viewState }: { viewState: ViewState }) =>
    setState((state) => ({ ...state, viewState }));

  const resizeMap = (mapDimensions: MapDimensions) => {
    const viewState =
      state.mapDimensions === null && state.viewState === INITIAL_VIEW_STATE
        ? computeIdealViewStateForBbox({
            mapDimensions,
            bbox: ANTWERP_BBOX,
          })
        : state.viewState;
    setState((state) => ({
      ...state,
      mapDimensions,
      viewState,
    }));
  };

  // flyTo makes sense only when mapDimensions are known, otherwise
  // the ideal view state for the feature collection cannot be computed
  const flyTo = state.mapDimensions
    ? (featureCollection: any, transitionProps = {}) => {
        const targetViewState = computeIdealViewstateForFeatureCollection({
          mapDimensions: state.mapDimensions,
          featureCollection,
        });
        const viewState = {
          ...targetViewState,
          ...transitionProps,
        };
        setState((state) => ({ ...state, viewState }));
      }
    : undefined;

  const resetMapDimensions = () => {
    setState((state) => ({ ...state, mapDimensions: null }));
  };

  return {
    viewState: state.viewState,
    setViewState,
    resizeMap,
    flyTo,
    resetMapDimensions,
  };
}

const container = createContainer(useMapViewStateHook);
export const MapViewStateProvider = container.Provider;
export const useMapViewState = container.useContainer;
