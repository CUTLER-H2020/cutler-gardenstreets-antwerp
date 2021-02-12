import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  InputBase,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Card,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import MapStyleContainer from '../stateContainers/mapStyle';
import { MAP_FILTER } from '../constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '260px',
      padding: '24px',
      float: 'left',
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none',
      overflowY: 'scroll',
    },
    formControl: {
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    card: {
      borderRadius: 0,
      padding: 24,
      height: '100%',
      backgroundColor: '#fff',
    },
    title: {
      marginTop: 0,
    },
    label: {
      marginTop: 24,
    },
  }),
);

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(1),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);

interface MapToolbarProps {
  mapboxLayersOnly?: boolean;
}

function MapToolbar({ mapboxLayersOnly = false }: MapToolbarProps) {
  const classes = useStyles();

  const {
    setFloodingLayer,
    setSectorLayer,
    setEnvironmentLayer,
    sectorLayer,
    environmentLayer,
    floodingLayer,
    floodingRiskLayers,
    sectorLayers,
    environmentLayers,
    eligibilityFilter,
    setEligibilityFilter,
    statusFilter,
    setStatusFilter,
  } = MapStyleContainer.useContainer();

  const handleFloodingChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const val = event.target.value as string;
    setFloodingLayer(val);
  };

  const handleSectorChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const val = event.target.value as string;
    setSectorLayer(val);
  };

  const handleEnvironmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEnvironmentLayer({
      ...environmentLayer,
      [event.target.name]: event.target.checked,
    });
  };

  const handleEligibilityChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const val = event.target.value as string;
    setEligibilityFilter(val);
  };

  const handleStatusChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const val = event.target.value as string;
    setStatusFilter(val);
  };

  return (
    <Card className={classes.container}>
      <h3 className={classes.title}>Customisation</h3>
      <p className={classes.label}>Flooding</p>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          value={floodingLayer}
          onChange={handleFloodingChange}
          inputProps={{
            name: 'id',
            id: 'outlined-input',
          }}
          input={<BootstrapInput />}
        >
          <MenuItem value="None">None</MenuItem>
          {floodingRiskLayers.map((layer) => {
            return (
              <MenuItem key={layer.id} value={layer.id}>
                {layer.id}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <p className={classes.label}>Sector</p>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          value={sectorLayer}
          onChange={handleSectorChange}
          inputProps={{
            name: 'id',
            id: 'outlined-input',
          }}
          input={<BootstrapInput />}
        >
          <MenuItem value="None">None</MenuItem>
          {sectorLayers.map((layer, i) => {
            return (
              <MenuItem key={i} value={layer.id}>
                {layer.id}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <p className={classes.label}>Environmental</p>
      <FormGroup>
        {environmentLayers.map((layer, i) => {
          return (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={layer.layout?.visibility === 'visible'}
                  onChange={handleEnvironmentChange}
                  name={layer.id}
                  color="primary"
                />
              }
              label={layer.id}
            />
          );
        })}
      </FormGroup>

      {!mapboxLayersOnly && (
        <>
          <p className={classes.label}>Eligibility</p>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              value={eligibilityFilter}
              onChange={handleEligibilityChange}
              inputProps={{
                name: 'id',
                id: 'outlined-input',
              }}
              input={<BootstrapInput />}
            >
              <MenuItem value={MAP_FILTER.ELIGIBILITY.ALL.value}>
                {MAP_FILTER.ELIGIBILITY.ALL.label}
              </MenuItem>
              <MenuItem value={MAP_FILTER.ELIGIBILITY.ELIGIBLE.value}>
                {MAP_FILTER.ELIGIBILITY.ELIGIBLE.label}
              </MenuItem>
              <MenuItem value={MAP_FILTER.ELIGIBILITY.NOT_ELIGIBLE.value}>
                {MAP_FILTER.ELIGIBILITY.NOT_ELIGIBLE.label}
              </MenuItem>
            </Select>
          </FormControl>
          <p className={classes.label}>Status</p>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              inputProps={{
                name: 'id',
                id: 'outlined-input',
              }}
              input={<BootstrapInput />}
            >
              <MenuItem value={MAP_FILTER.STATUS.ALL.value}>
                {MAP_FILTER.STATUS.ALL.label}
              </MenuItem>
              <MenuItem value={MAP_FILTER.STATUS.EXISTING.value}>
                {MAP_FILTER.STATUS.EXISTING.label}
              </MenuItem>
              <MenuItem value={MAP_FILTER.STATUS.PROPOSED.value}>
                {MAP_FILTER.STATUS.PROPOSED.label}
              </MenuItem>
            </Select>
          </FormControl>
        </>
      )}
    </Card>
  );
}

export default MapToolbar;
