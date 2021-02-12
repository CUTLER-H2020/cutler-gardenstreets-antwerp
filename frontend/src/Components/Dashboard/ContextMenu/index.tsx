import MenuList from '@material-ui/core/MenuList';
import RootRef from '@material-ui/core/RootRef';
import React, { useRef } from 'react';
import { Feature } from '@turf/helpers';

import useClickOutsideListener from '../../../hooks/useClickOutsideListener';
import MarkerMenuItems from './MarkerMenuItems';
import GardenStreetMenuItems from './GardenStreetMenuItems';

export interface Props {
  entityType: 'marker' | 'garden-street';
  feature: Feature;
  closeContextMenu: () => void;
}

export function ContextMenu(props: Props) {
  const ref = useRef<HTMLElement>(null);
  useClickOutsideListener(ref, props.closeContextMenu);

  const { entityType } = props;
  if (entityType !== 'marker' && entityType !== 'garden-street') {
    return null;
  }

  return (
    <RootRef rootRef={ref}>
      <MenuList>
        {entityType === 'garden-street' && <GardenStreetMenuItems {...props} />}
        {entityType === 'marker' && <MarkerMenuItems {...props} />}
      </MenuList>
    </RootRef>
  );
}
