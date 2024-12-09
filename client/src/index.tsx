import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import THEME from './theme';
import { ThemeProvider } from '@mui/material';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Auth0Provider
    domain={`${process.env.REACT_APP_AUTH0_DOMAIN}`}
    clientId={`${process.env.REACT_APP_AUTH0_CLIENT_ID}`}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <ThemeProvider theme={THEME}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ThemeProvider>
  </Auth0Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
