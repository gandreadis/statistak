import * as React from 'react';
import { Grid, Typography } from '@material-ui/core';

type InfoItemProps = {
  icon: React.ReactElement;
  children: any;
};

const InfoItem = ({ icon, children }: InfoItemProps) => (
  <Grid container spacing={3}>
    <Grid item xs={1}>
      {icon}
    </Grid>
    <Grid item>
      <Typography variant="body1" component="p">
        {children}
      </Typography>
    </Grid>
  </Grid>
);

export default InfoItem;
