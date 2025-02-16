import React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import {
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Page from '../../containers/navigation/Page';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '&>*': {
        margin: theme.spacing(1),
      },
    },
  }),
);

type EditableTourProps = {
  title: string;
  onSubmit: (e: React.MouseEvent) => Promise<void>;
  handleInputChanges: (name: string, value: any) => void;
  submitSuccess: boolean;
  loading: boolean;
  tour: any;
};

const EditableTour = ({ title, onSubmit, handleInputChanges, submitSuccess, loading, tour }: EditableTourProps) => {
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
      <form id="tour-form" noValidate={true} className={(classes as any).root}>
        <TextField
          id="title-field"
          name="title"
          label="Title"
          onChange={handleStandardInputChange}
          value={tour.title}
          fullWidth
          variant="outlined"
          style={{marginBottom: 10}}
        />
        <TextField
          id="year-field"
          name="year"
          label="Year"
          onChange={handleStandardInputChange}
          value={tour.year}
          fullWidth
          type="number"
          variant="outlined"
          style={{marginBottom: 10}}
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Season</FormLabel>
          <RadioGroup name="season" value={tour.season} onChange={handleStandardInputChange}>
            <FormControlLabel value="Spring" control={<Radio />} label="Spring" />
            <FormControlLabel value="Summer" control={<Radio />} label="Summer" />
            <FormControlLabel value="Fall" control={<Radio />} label="Fall" />
            <FormControlLabel value="Winter" control={<Radio />} label="Winter" />
          </RadioGroup>
        </FormControl>
        <TextField
          id="color-field"
          name="color"
          label="Color"
          onChange={handleStandardInputChange}
          value={tour.color}
          fullWidth
          variant="outlined"
          style={{ fontFamily: 'monospace' }}
        />
      </form>
    </Page>
  );
};

export default EditableTour;
