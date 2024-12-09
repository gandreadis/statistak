import React from 'react';
import './App.css';
import { CssBaseline } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router';
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
import NotFoundPage from './components/notfound/NotFoundPage';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Routes>
        <Route path={'/'} element={<ViewAllTours/>} />
        <Route path={'/about'} element={<AboutPage/>} />
        <Route path={'/tours'} element={<Navigate to="/" />} />
        <Route path={'/tours/create'} element={<CreateTour/>} />
        <Route path={'/tours/:tourId'} element={<ViewTour/>} />
        <Route path={'/tours/:tourId/edit'} element={<EditTour/>} />
        <Route path={'/tours/:tourId/performances'} element={<ViewAllPerformances/>} />
        <Route path={'/tours/:tourId/performances/create'} element={<CreatePerformance/>} />
        <Route path={'/tours/:tourId/performances/:performanceId'} element={<ViewPerformance/>} />
        <Route path={'/tours/:tourId/performances/:performanceId/edit'} element={<EditPerformance/>} />
        <Route path={'/tours/:tourId/pieces'} element={<ViewAllPieces/>} />
        <Route path={'/tours/:tourId/pieces/create'} element={<CreatePiece/>} />
        <Route path={'/tours/:tourId/pieces/:pieceId'} element={<ViewPiece/>} />
        <Route path={'/tours/:tourId/pieces/:pieceId/edit'} element={<EditPiece/>} />
        <Route path={'/tours/:tourId/charts'} element={<ViewCharts/>} />
        <Route path={'/tours/:tourId/stats'} element={<ViewStats/>} />
        <Route element={<NotFoundPage/>} />
      </Routes>
    </div>
  );
}

export default App;
