import moment from 'moment';

export const EMPTY_TOUR_OBJECT = {
  title: '',
  year: parseInt(moment().format('YYYY')),
  season: 'Spring',
};
