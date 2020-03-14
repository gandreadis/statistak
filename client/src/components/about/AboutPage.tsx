import * as React from 'react';
import Page from '../../containers/navigation/Page';
import { Typography } from '@material-ui/core';

const AboutPage = () => (
  <Page title="About">
    <Typography variant="subtitle1" component="p">
      A tour log of all performances of the <a href="https://ricciotti.nl/">Ricciotti Ensemble</a> for recent tours! See
      an interactive history of performances, find out which pieces where most popular in each tour, and have a look at
      a number of stats!
    </Typography>
    <br />
    <Typography variant="subtitle1" component="p">
      Created by <a href="https://gandreadis.com">Georgios Andreadis</a>. View the source and submit improvements on{' '}
      <a href="https://github.com/gandreadis/statistak/">GitHub</a>! If you have suggestions or feedback on the app, please
      don't hesitate to send them to <a href="mailto:info@gandreadis.com">info@gandreadis.com</a>.
    </Typography>
  </Page>
);

export default AboutPage;
