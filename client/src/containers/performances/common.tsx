import moment from 'moment';

export const EMPTY_PERFORMANCE_OBJECT = {
  locationName: '',
  city: '',
  country: 'NL',
  date: moment().format('YYYY-MM-DD'),
  time: moment().format('HH:mm'),
  isOutside: false,
  type: 'SO',
  audienceCount: 0,
  guestConductor: '',
  isWithCollection: false,
  isWithCDSale: false,
  isWithSponsorTalk: false,
  comments: '',
  pieces: [],
};
