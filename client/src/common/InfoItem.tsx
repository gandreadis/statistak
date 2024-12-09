import * as React from 'react';
import { Grid2, Typography } from '@mui/material';

type InfoItemProps = {
  icon: React.ReactElement;
  children: any;
};

const InfoItem = ({ icon, children }: InfoItemProps) => (
  <Grid2 container spacing={3}>
    <Grid2 size={{xs: 1}}>
      {icon}
    </Grid2>
    <Grid2>
      <Typography variant="body1" component="p">
        {children}
      </Typography>
    </Grid2>
  </Grid2>
);

export default InfoItem;
