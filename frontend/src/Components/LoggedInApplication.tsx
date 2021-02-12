import { Redirect, RouteComponentProps, Router } from '@reach/router';
import React from 'react';

import Dashboard from './Dashboard';
import GardenStreetForm, { GardenStreetFormProps } from './GardenStreetForm';
import MapStyleContainer from '../stateContainers/mapStyle';

const DashboardRoute = (props: RouteComponentProps) => <Dashboard />;
const GardenStreetFormRoute = (
  props: RouteComponentProps & GardenStreetFormProps,
) => <GardenStreetForm mode={props.mode} id={props.id} />;

function LoggedInApplication() {
  const { error, isMapStyleReady } = MapStyleContainer.useContainer();
  if (error) {
    return <div>Could not load required config for the app</div>;
  }
  if (!isMapStyleReady) {
    return <div>Loading</div>;
  }
  return (
    <Router>
      <DashboardRoute path="/garden-streets" />
      <GardenStreetFormRoute mode="create" path="/garden-streets/new" />
      <GardenStreetFormRoute mode="edit" path="/garden-streets/edit/:id" />
      <Redirect default noThrow from="*" to="/garden-streets" />
    </Router>
  );
}

export default LoggedInApplication;
