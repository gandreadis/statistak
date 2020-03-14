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
import NotFoundPage from "./components/notfound/NotFoundPage";

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Switch>
        <Route path={'/'} exact component={ViewAllTours} />
        <Route path={'/about'} exact component={AboutPage} />
        <Route path={'/tours'} exact component={() => <Redirect to="/" />} />
        <Route path={'/tours/create'} exact component={CreateTour} />
        <Route path={'/tours/:tourId'} exact component={ViewTour} />
        <Route path={'/tours/:tourId/edit'} exact component={EditTour} />
        <Route path={'/tours/:tourId/performances'} exact component={ViewAllPerformances} />
        <Route path={'/tours/:tourId/performances/create'} exact component={CreatePerformance} />
        <Route path={'/tours/:tourId/performances/:performanceId'} exact component={ViewPerformance} />
        <Route path={'/tours/:tourId/performances/:performanceId/edit'} exact component={EditPerformance} />
        <Route path={'/tours/:tourId/pieces'} exact component={ViewAllPieces} />
        <Route path={'/tours/:tourId/pieces/create'} exact component={CreatePiece} />
        <Route path={'/tours/:tourId/pieces/:pieceId'} exact component={ViewPiece} />
        <Route path={'/tours/:tourId/pieces/:pieceId/edit'} exact component={EditPiece} />
        <Route path={'/tours/:tourId/charts'} exact component={ViewCharts} />
        <Route path={'/tours/:tourId/stats'} exact component={ViewStats} />
        <Route component={NotFoundPage}/>
      </Switch>
    </div>
  );
}

export default App;
