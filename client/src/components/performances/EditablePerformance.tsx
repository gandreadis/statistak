import React from 'react';
import AppBarActionButton from '../navigation/AppBarActionButton';
import {
  Box,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Page from '../../containers/navigation/Page';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import moment from 'moment';
import { PERFORMANCE_TYPES } from './common';
import SelectPieces from '../../containers/pieces/SelectPieces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '&>*': {
        margin: theme.spacing(1),
      },
    },
    datePicker: {
      marginRight: theme.spacing(2),
    },
  }),
);

type EditablePerformanceProps = {
  title: string;
  onSubmit: (e: React.MouseEvent) => Promise<void>;
  handleInputChanges: (name: string, value: any) => void;
  submitSuccess: boolean;
  loading: boolean;
  performance: any;
};

const EditablePerformance = ({
  title,
  onSubmit,
  handleInputChanges,
  submitSuccess,
  loading,
  performance,
}: EditablePerformanceProps) => {
  const classes = useStyles();

  const handleStandardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleInputChanges(e.target.name, e.target.value);
  };

  const handleCheckInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChanges(e.target.name, e.target.checked);
  };

  return (
    <Page
      title={title}
      actionButton={
        <AppBarActionButton onClick={onSubmit} loading={loading} actionSuccess={submitSuccess} icon={<SaveIcon />} />
      }
    >
      <form id="performance-form" noValidate={true} className={classes.root}>
        <TextField
          id="location-name-field"
          name="locationName"
          label="Location"
          onChange={handleStandardInputChange}
          value={performance.locationName}
          fullWidth
          variant="outlined"
        />
        <TextField
          id="city-field"
          name="city"
          label="City"
          onChange={handleStandardInputChange}
          value={performance.city}
          fullWidth
          variant="outlined"
        />
        <TextField
          id="country-field"
          name="country"
          label="Country"
          onChange={handleStandardInputChange}
          value={performance.country}
          fullWidth
          variant="outlined"
        />
        <div>
          <DatePicker
            className={classes.datePicker}
            value={moment(performance.date, 'YYYY-MM-DD')}
            onChange={date => {
              const usableDate = date === null ? moment() : date;
              handleInputChanges('date', usableDate.format('YYYY-MM-DD'));
            }}
          />
          <TimePicker
            value={moment(performance.time, 'HH:mm')}
            onChange={time => {
              const usableTime = time === null ? moment() : time;
              handleInputChanges('time', usableTime.format('HH:mm'));
            }}
          />
        </div>
        <div>
          <FormControlLabel
            control={<Checkbox checked={performance.isOutside} onChange={handleCheckInputChange} name="isOutside" />}
            label="Outside"
          />
        </div>
        <TextField
          id="audience-count-field"
          name="audienceCount"
          label="Audience Count"
          onChange={handleStandardInputChange}
          value={performance.audienceCount}
          fullWidth
          variant="outlined"
          type="number"
          multiline
        />
        <TextField
          id="guest-conductor-field"
          name="guestConductor"
          label="Guest conductor"
          onChange={handleStandardInputChange}
          value={performance.guestConductor}
          fullWidth
          variant="outlined"
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup name="type" value={performance.type} onChange={handleStandardInputChange}>
            <FormControlLabel value="SO" control={<Radio />} label={PERFORMANCE_TYPES['SO']} />
            <FormControlLabel value="SB" control={<Radio />} label={PERFORMANCE_TYPES['SB']} />
            <FormControlLabel value="O" control={<Radio />} label={PERFORMANCE_TYPES['O']} />
            <FormControlLabel value="WO" control={<Radio />} label={PERFORMANCE_TYPES['WO']} />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">Sponsoring actions</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={performance.isWithCollection}
                onChange={handleCheckInputChange}
                name="isWithCollection"
              />
            }
            label="With collection afterwards"
          />
          <FormControlLabel
            control={
              <Checkbox checked={performance.isWithCDSale} onChange={handleCheckInputChange} name="isWithCDSale" />
            }
            label="With CD sale"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={performance.isWithSponsorTalk}
                onChange={handleCheckInputChange}
                name="isWithSponsorTalk"
              />
            }
            label="With groupies talk"
          />
        </FormControl>
        <Box mt={2} mb={2}>
          <Typography variant="h5" component="h2" align="center">
            Pieces
          </Typography>
        </Box>
        <SelectPieces
          selectedPieceIds={performance.pieces}
          setSelectedPieceIds={newSelectedPieceIds => handleInputChanges('pieces', newSelectedPieceIds)}
        />
      </form>
    </Page>
  );
};

export default EditablePerformance;
