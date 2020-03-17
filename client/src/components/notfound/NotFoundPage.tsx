import * as React from 'react';
import Page from '../../containers/navigation/Page';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Page title="404 - Not Found">
    <Typography variant="h5" component="p">
      This page was not found... <Link to="/">Return Home</Link>
    </Typography>
  </Page>
);

export default NotFoundPage;
