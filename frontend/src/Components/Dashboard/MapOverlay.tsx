import find from 'lodash/find';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React, { useMemo, useState } from 'react';

import GardenStreetsContainer from '../../stateContainers/gardenStreets';
import { formatEligible, formatNumber, formatString } from '../../utils/format';

const TYPE_LABELS = [
  { label: 'Type 1', fieldSuffix: 'Type1' },
  { label: 'Type 2', fieldSuffix: 'Type2' },
  { label: 'Type 3', fieldSuffix: 'Type3' },
];

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      padding: 24,
      position: 'relative',
      width: '260px',
      backgroundColor: 'rgba(0,0,0,.5)',
      color: 'white',
    },
    close: {
      position: 'absolute',
      top: 8,
      right: 8,
      cursor: 'pointer',
    },
  }),
);

function MapOverlay() {
  const classes = useStyles();

  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);

  const {
    gardenStreets,
    selectedGardenStreetId,
    setSelectedGardenStreetId,
  } = GardenStreetsContainer.useContainer();

  const gardenStreetInfo = useMemo(() => {
    return find(
      gardenStreets,
      (street) => street.id === selectedGardenStreetId,
    );
  }, [selectedGardenStreetId, gardenStreets]);

  const handleClose = () => {
    setSelectedGardenStreetId('');
  };

  const fieldSuffix = TYPE_LABELS[selectedTypeIndex].fieldSuffix;
  return !!gardenStreetInfo ? (
    <Card className={classes.card}>
      <CloseIcon onClick={handleClose} className={classes.close} />
      <h3>{gardenStreetInfo.name}</h3>

      <p>
        <b>Type: </b>
        {formatString(gardenStreetInfo.type)}
      </p>

      <p>
        <b>Area: </b>
        {formatNumber(gardenStreetInfo.area)} m&sup2;
      </p>

      <p>
        <b>Evaluation: </b>
        {formatString(gardenStreetInfo.evaluation)}
      </p>
      <p>
        <b>Remarks: </b>
        {formatString(gardenStreetInfo.remarks)}
      </p>

      <ButtonGroup size="small" variant="contained">
        {TYPE_LABELS.map((el, index) => (
          <Button
            key={el.label}
            color={index === selectedTypeIndex ? 'primary' : 'default'}
            onClick={() => setSelectedTypeIndex(index)}
          >
            {el.label}
          </Button>
        ))}
      </ButtonGroup>

      <p>
        <b>Eligible: </b>
        {/* @ts-ignore */}
        {formatEligible(gardenStreetInfo[`eligible${fieldSuffix}`])}
      </p>

      <p>
        <b>Benefits: </b>
        {/* @ts-ignore */}
        {formatNumber(gardenStreetInfo[`benefits${fieldSuffix}`])} €
      </p>

      <p>
        <b>Costs: </b>
        {/* @ts-ignore */}
        {formatNumber(gardenStreetInfo[`costs${fieldSuffix}`])} €
      </p>

      <p>
        <b>Profits: </b>
        {/* @ts-ignore */}
        {formatNumber(gardenStreetInfo[`profits${fieldSuffix}`])} €
      </p>
    </Card>
  ) : null;
}

export default MapOverlay;
