import * as React from 'react';
import Page from '../../containers/navigation/Page';
import { Typography } from '@material-ui/core';

const NotFoundPage = () => (
  <Page title="404 - Not Found">
    <Typography variant="h5" component="p">
      This page was not found...
    </Typography>
  </Page>
);

export default NotFoundPage;
