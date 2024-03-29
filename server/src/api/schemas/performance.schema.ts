import { Schema } from 'mongoose';

export const PerformanceSchema = new Schema({
  locationName: String,
  city: String,
  country: String,
  date: String,
  time: String,
  duration: Number,
  isOutside: Boolean,
  type: String,
  audienceCount: Number,
  guestConductor: String,
  isWithCollection: Boolean,
  isWithCDSale: Boolean,
  isWithSponsorTalk: Boolean,
  comments: String,
  videos: [
    {
      url: String,
      pieces: [{ type: Schema.Types.ObjectId, ref: 'Piece' }],
    },
  ],
  pieces: [{ type: Schema.Types.ObjectId, ref: 'Piece' }],
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
});
