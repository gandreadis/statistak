import React from 'react';
import './App.css';
import { CssBaseline } from '@material-ui/core';
import { Redirect, Route, Switch } from 'react-router';
import ViewAllPerformances from './containers/performances/ViewAllPerformances';
import ViewPerformance from './containers/performances/ViewPerformance';
import EditPerformance from './containers/performances/EditPerformance';
import CreatePerformance from './containers/performances/CreatePerformance';
import ViewAllPieces from './containers/pieces/ViewAllPieces';
import CreatePiece from './containers/pieces/CreatePiece';
import ViewPiece from './containers/pieces/ViewPiece';
import EditPiece from './containers/pieces/EditPiece';
import ViewCharts from './containers/charts/ViewCharts';
import ViewTour from './containers/tours/ViewTour';
import ViewAllTours from './containers/tours/ViewAllTours';
import CreateTour from './containers/tours/CreateTour';
import EditTour from './containers/tours/EditTour';
import ViewStats from './containers/stats/ViewStats';
import AboutPage from './components/about/AboutPage';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Switch>
        <Route path={'/'} exact={true} component={ViewAllTours} />
        <Route path={'/about'} exact={true} component={AboutPage} />
        <Route path={'/tours'} exact={true} component={() => <Redirect to="/" />} />
        <Route path={'/tours/create'} exact={true} component={CreateTour} />
        <Route path={'/tours/:tourId'} exact={true} component={ViewTour} />
        <Route path={'/tours/:tourId/edit'} exact={true} component={EditTour} />
        <Route path={'/tours/:tourId/performances'} exact={true} component={ViewAllPerformances} />
        <Route path={'/tours/:tourId/performances/create'} exact={true} component={CreatePerformance} />
        <Route path={'/tours/:tourId/performances/:performanceId'} exact={true} component={ViewPerformance} />
        <Route path={'/tours/:tourId/performances/:performanceId/edit'} exact={true} component={EditPerformance} />
        <Route path={'/tours/:tourId/pieces'} exact={true} component={ViewAllPieces} />
        <Route path={'/tours/:tourId/pieces/create'} exact={true} component={CreatePiece} />
        <Route path={'/tours/:tourId/pieces/:pieceId'} exact={true} component={ViewPiece} />
        <Route path={'/tours/:tourId/pieces/:pieceId/edit'} exact={true} component={EditPiece} />
        <Route path={'/tours/:tourId/charts'} exact={true} component={ViewCharts} />
        <Route path={'/tours/:tourId/stats'} exact={true} component={ViewStats} />
      </Switch>
    </div>
  );
}

export default App;
