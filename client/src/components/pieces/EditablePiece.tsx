import React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import Page from '../../containers/navigation/Page';
import { TextField } from '@mui/material';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '&>*': {
        margin: theme.spacing(1),
      },
    },
  }),
);

type EditablePieceProps = {
  title: string;
  onSubmit: (e: React.MouseEvent) => Promise<void>;
  handleInputChanges: (name: string, value: any) => void;
  submitSuccess: boolean;
  loading: boolean;
  piece: any;
};

const EditablePiece = ({ title, onSubmit, handleInputChanges, submitSuccess, loading, piece }: EditablePieceProps) => {
  const classes = useStyles();

  const handleStandardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleInputChanges(e.target.name, e.target.value);
  };

  return (
    <Page
      title={title}
      actionButton={
        <AppBarActionButton onClick={onSubmit} loading={loading} actionSuccess={submitSuccess} icon={<SaveIcon />} />
      }
    >
      <form id="piece-form" noValidate={true} className={(classes as any).root}>
        <TextField
          id="title-field"
          name="title"
          label="Title"
          onChange={handleStandardInputChange}
          value={piece.title}
          fullWidth
          variant="outlined"
        />
        <TextField
          id="composer-field"
          name="composer"
          label="Composer"
          onChange={handleStandardInputChange}
          value={piece.composer}
          fullWidth
          variant="outlined"
        />
        <TextField
          id="arranger-field"
          name="arranger"
          label="Arranger"
          onChange={handleStandardInputChange}
          value={piece.arranger}
          fullWidth
          variant="outlined"
        />
        <TextField
          id="duration-field"
          name="duration"
          label="Duration (in minutes)"
          onChange={handleStandardInputChange}
          value={piece.duration}
          fullWidth
          type="number"
          variant="outlined"
        />
        <TextField
          id="code-field"
          name="code"
          label="Code"
          onChange={handleStandardInputChange}
          value={piece.code}
          fullWidth
          variant="outlined"
        />
      </form>
    </Page>
  );
};

export default EditablePiece;
