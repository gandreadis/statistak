import * as React from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

type AppBarActionButtonProps = {
  onClick: (e: any) => any;
  loading: boolean;
  actionSuccess: boolean;
  icon: React.ReactNode;
};

const AppBarActionButton = ({ onClick, actionSuccess, loading, icon }: AppBarActionButtonProps) =>
  loading ? (
    <CircularProgress />
  ) : actionSuccess ? (
    <CheckIcon />
  ) : (
    <IconButton color="inherit" onClick={onClick}>
      {icon}
    </IconButton>
  );

export default AppBarActionButton;
