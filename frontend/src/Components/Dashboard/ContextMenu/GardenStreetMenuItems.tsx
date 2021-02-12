import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';

import { Props } from '.';
import useGardenStreetActions from '../../../hooks/useGardenStreetActions';

export default function GardenStreetMenuItems(props: Props) {
  const {
    deleteGardenStreet,
    editGardenStreet,
    selectGardenStreet,
  } = useGardenStreetActions();

  const gardenStreetId = props.feature.properties?.id;

  const handleFlyToClick = () => {
    props.closeContextMenu();
    selectGardenStreet(gardenStreetId);
  };

  const handleEditClick = () => {
    props.closeContextMenu();
    editGardenStreet(gardenStreetId);
  };

  const handleDeleteClick = () => {
    props.closeContextMenu();
    deleteGardenStreet(gardenStreetId);
  };

  return (
    <>
      <MenuItem onClick={handleFlyToClick}>Fly To</MenuItem>
      <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
    </>
  );
}
