import { SnackbarProvider } from 'notistack';
import { Redirect, RouteComponentProps, Router } from '@reach/router';
import React, { useContext } from 'react';

import LoggedInApplication from './LoggedInApplication';
import ResetPassword from './ResetPassword';
import SignInSide from './SignIn';
import ModalsManager from '../Components/ModalsManager';
import { UserContext } from '../providers/UserProvider';
import GardenStreetsContainer from '../stateContainers/gardenStreets';
import MapStyleContainer from '../stateContainers/mapStyle';
import { MapViewStateProvider } from '../stateContainers/mapViewState';
import MarkersContainer from '../stateContainers/markers';
import { ModalsProvider } from '../stateContainers/modals';

const SignIn = (props: RouteComponentProps) => <SignInSide />;
const PasswordReset = (props: RouteComponentProps) => <ResetPassword />;

function Application() {
  const user = useContext(UserContext);
  return user ? (
    <SnackbarProvider>
      <GardenStreetsContainer.Provider>
        <MarkersContainer.Provider>
          <MapStyleContainer.Provider>
            <MapViewStateProvider>
              <ModalsProvider>
                <ModalsManager />
                <LoggedInApplication />
              </ModalsProvider>
            </MapViewStateProvider>
          </MapStyleContainer.Provider>
        </MarkersContainer.Provider>
      </GardenStreetsContainer.Provider>
    </SnackbarProvider>
  ) : (
    <Router>
      <SignIn path="/" />
      <PasswordReset path="passwordReset" />
      <Redirect default noThrow from="*" to="/" />
    </Router>
  );
}

export default Application;
