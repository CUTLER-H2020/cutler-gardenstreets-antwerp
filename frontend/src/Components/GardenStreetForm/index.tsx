import { pick } from 'lodash';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { navigate } from '@reach/router';
import React, { useState } from 'react';

import Form from './Form';
import Map from './Map';
import MapToolbar from '../MapToolbar';
import useNotifications from '../../hooks/useNotifications';
import { FormGardenStreet, Tuinstraat } from '../../models/Tuinstraat';
import GardenStreetsContainer from '../../stateContainers/gardenStreets';

const TITLE_CREATE_MODE = 'Create new Garden Street';
const TITLE_EDIT_MODE = 'Edit Garden Street';

export interface GardenStreetFormProps {
  mode: 'create' | 'edit';
  id?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
  },
  backButton: {
    color: 'white',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    height: '100%',
  },
  container: {
    height: '100%',
  },
  formContainer: {
    width: 400,
    padding: theme.spacing(3),
  },
  mapContainer: {
    position: 'relative',
  },
  mapToolbarContainer: {
    flexGrow: 0,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  mapToolbarToggler: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: '1px solid rgba(0,0,0,.1)',
    borderRadius: 0,
  },
}));

const getNewFormGardenStreet = (): FormGardenStreet => ({
  name: '',
  status: '',
  type: null,
  eligibleType1: null,
  eligibleType2: null,
  eligibleType3: null,
  evaluation: null,
  remarks: null,
  geometry: null,
});

const deriveFormGardenStreet = (gardenStreet: Tuinstraat): FormGardenStreet =>
  pick(gardenStreet, [
    'name',
    'status',
    'type',
    'eligibleType1',
    'eligibleType2',
    'eligibleType3',
    'evaluation',
    'remarks',
    'geometry',
  ]);

const validate = (values: FormGardenStreet) => {
  const errors: any = {};

  if (values.name.length === 0) {
    errors.name = 'Please fill in the name';
  }
  if (values.status.length === 0) {
    errors.status = 'Please select the status';
  }
  if (values.geometry === null) {
    errors.geometry = 'Please draw the polygon';
  }
  return errors;
};

function GardenStreetForm({ id, mode }: GardenStreetFormProps) {
  const classes = useStyles();

  const [mapToolbarIsOpen, setMapToolbarIsOpen] = useState<boolean>(false);

  const {
    gardenStreets,
    create,
    update,
  } = GardenStreetsContainer.useContainer();
  const gardenStreet = gardenStreets.find((el) => el.id === id) as Tuinstraat;
  const derivationFunc =
    mode === 'create' ? getNewFormGardenStreet : deriveFormGardenStreet;
  const initialFormGardenStreet = derivationFunc(gardenStreet);
  const [formGardenStreet, setFormGardenStreet] = useState(
    initialFormGardenStreet,
  );

  const { enqueueNotification } = useNotifications();

  const goBack = () => navigate(-1);
  const onSubmit = async () => {
    try {
      if (mode === 'create') {
        await create(formGardenStreet);
      } else {
        const gardenStreetId = id as string;
        await update(gardenStreetId, formGardenStreet);
      }
      goBack();
    } catch (error) {
      enqueueNotification({ type: 'error', message: error.message });
    }
  };

  const errors = validate(formGardenStreet);
  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" onClick={goBack}>
              <ArrowBackIcon className={classes.backButton} />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              {mode === 'create' ? TITLE_CREATE_MODE : TITLE_EDIT_MODE}
            </Typography>
          </Toolbar>
        </AppBar>

        {/*
          This second toolbar is a hack to give a height to the app bar
          see: https://material-ui.com/components/app-bar/#fixed-placement
        */}
        <Toolbar></Toolbar>
      </Grid>

      <Grid item className={classes.content}>
        <Paper className={classes.paper}>
          <Grid container direction="row" className={classes.container}>
            <Box className={classes.formContainer}>
              <Form
                values={formGardenStreet}
                errors={errors}
                updateValue={(key: string, value: any) =>
                  setFormGardenStreet({ ...formGardenStreet, [key]: value })
                }
                onCancel={goBack}
                onSubmit={onSubmit}
              />
            </Box>
            <Grid xs item className={classes.mapContainer}>
              <Map
                mode={mode}
                geometry={formGardenStreet.geometry}
                updateGeometry={(geometry: object) => {
                  setFormGardenStreet((props) => ({
                    ...props,
                    geometry,
                  }));
                }}
              />
            </Grid>
            <Grid xs item className={classes.mapToolbarContainer}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                className={classes.mapToolbarToggler}
                onClick={() => setMapToolbarIsOpen(!mapToolbarIsOpen)}
                component="span"
              >
                {mapToolbarIsOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
              {mapToolbarIsOpen && <MapToolbar mapboxLayersOnly />}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default GardenStreetForm;
