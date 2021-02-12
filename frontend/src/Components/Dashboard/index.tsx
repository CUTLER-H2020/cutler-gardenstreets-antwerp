import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { useState } from 'react';

import { auth } from '../../firebase';
import Map from './Map';
import MapToolbar from '../MapToolbar';
import MapOverlay from './MapOverlay';
import TuinstratenTable from './TuinstratenTable';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.imec.be/" target="_blank">
        Imec
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  // general layout
  rootContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  appBarContainer: {
    flex: '0 0 auto',
  },
  contentContainer: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  mapContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  tableContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: '0 0 auto',
  },
  copyrightContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flex: '0 0 auto',
  },

  // inside mapContainer layout
  mapToolbarItem: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  mapItem: {
    flex: '1 1 auto',
    position: 'relative',
  },
  mapOverlayContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    maxHeight: '100%',
    overflowY: 'scroll',
    padding: theme.spacing(1),
    zIndex: 1,
  },

  // components styling
  appBar: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0px 2px 10px 1px rgba(99, 109, 130, 0.3)',
  },
  title: {
    flexGrow: 1,
    fontSize: '1.15rem',
  },
  logout: {
    fontSize: '1rem',
    textTransform: 'none',
  },
  appBarSpacer: theme.mixins.toolbar,
  mapToolbarToggler: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: '1px solid rgba(0,0,0,.1)',
    borderRadius: 0,
  },
  paper: {
    boxShadow: '0px 2px 10px 1px rgba(99, 109, 130, 0.3)',
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const [mapToolbarIsOpen, setMapToolbarIsOpen] = useState(true);

  function onHandleLogout() {
    auth
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        console.error('Failed to log out', error);
      });
  }

  return (
    <div className={classes.rootContainer}>
      <CssBaseline />

      <Box className={classes.appBarContainer}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Garden street decision Dashboard
            </Typography>

            <Button
              className={classes.logout}
              color="inherit"
              onClick={onHandleLogout}
            >
              Logout &nbsp;
              <ExitToAppIcon />
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.appBarSpacer} />
      </Box>

      <Container maxWidth="xl" className={classes.contentContainer}>
        <Paper className={`${classes.paper} ${classes.mapContainer}`}>
          <Box className={classes.mapToolbarItem}>
            {mapToolbarIsOpen && <MapToolbar />}
            <IconButton
              color="primary"
              aria-label="upload picture"
              className={classes.mapToolbarToggler}
              onClick={() => setMapToolbarIsOpen(!mapToolbarIsOpen)}
              component="span"
            >
              {mapToolbarIsOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>

          <Box className={classes.mapItem}>
            <Map />
            <Box className={classes.mapOverlayContainer}>
              <MapOverlay />
            </Box>
          </Box>
        </Paper>

        <Paper className={`${classes.paper} ${classes.tableContainer}`}>
          <TuinstratenTable />
        </Paper>

        <Box className={classes.copyrightContainer}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
}
