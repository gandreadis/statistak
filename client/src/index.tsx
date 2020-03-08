import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './contexts/auth0-context';
import { BrowserRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import THEME from './theme';
import { ThemeProvider } from '@material-ui/core';

ReactDOM.render(
  <Auth0Provider>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={THEME}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  </Auth0Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
