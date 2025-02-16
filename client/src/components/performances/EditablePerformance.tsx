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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Page from '../../containers/navigation/Page';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/nl';
import { makeStyles } from '@mui/styles';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { PERFORMANCE_TYPES } from './common';
import withPieces from '../../containers/performances/withPieces';
import EditableVideoList from './EditableVideoList';
import SelectablePieceList from '../pieces/SelectablePieceList';
import { PieceDto } from '../../../../server/src/api/dtos/piece.dto';
import { PieceProps } from '../pieces/PieceList';

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
  allPieces?: PieceDto[];
};

const EditablePerformance = ({
  title,
  onSubmit,
  handleInputChanges,
  submitSuccess,
  loading,
  performance,
  allPieces,
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
      <form id="performance-form" noValidate={true} className={(classes as any).root}>
        <TextField
          id="location-name-field"
          name="locationName"
          label="Location"
          onChange={handleStandardInputChange}
          value={performance.locationName}
          fullWidth
          variant="outlined"
          style={{marginBottom: 10}}
        />
        <TextField
          id="city-field"
          name="city"
          label="City"
          onChange={handleStandardInputChange}
          value={performance.city}
          fullWidth
          variant="outlined"
          style={{marginBottom: 10}}
        />
        <TextField
          id="country-field"
          name="country"
          label="Country"
          onChange={handleStandardInputChange}
          value={performance.country}
          fullWidth
          variant="outlined"
          style={{marginBottom: 10}}
        />
        <div>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="nl">
            <DatePicker
              className={(classes as any).datePicker}
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
          </LocalizationProvider>
        </div>
        <TextField
          id="duration-field"
          name="duration"
          label="Duration (in minutes)"
          onChange={handleStandardInputChange}
          value={performance.duration}
          fullWidth
          variant="outlined"
          type="number"
          multiline
          style={{marginBottom: 10}}
        />
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
          style={{marginBottom: 10}}
        />
        <TextField
          id="guest-conductor-field"
          name="guestConductor"
          label="Guest conductor"
          onChange={handleStandardInputChange}
          value={performance.guestConductor}
          fullWidth
          variant="outlined"
          style={{marginBottom: 10}}
        />
        <TextField
          id="comments-field"
          name="comments"
          label="Comments"
          onChange={handleStandardInputChange}
          value={performance.comments}
          fullWidth
          variant="outlined"
          style={{marginBottom: 10}}
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
        <Box pt={2} pb={1}>
          <Typography variant="h5" component="h2" align="center">
            Pieces
          </Typography>
        </Box>
        <SelectablePieceList
          allPieces={allPieces as PieceProps[]}
          selectedPieceIds={performance.pieces}
          setSelectedPieceIds={newSelectedPieceIds => handleInputChanges('pieces', newSelectedPieceIds)}
        />
        <Box pt={2} pb={1}>
          <Typography variant="h5" component="h2" align="center">
            Videos
          </Typography>
        </Box>
        <EditableVideoList
          allPieces={allPieces as PieceDto[]}
          videos={performance.videos}
          setVideos={newVideos => handleInputChanges('videos', newVideos)}
        />
      </form>
    </Page>
  );
};

export default (withPieces(EditablePerformance) as unknown) as React.ComponentClass<EditablePerformanceProps>;
