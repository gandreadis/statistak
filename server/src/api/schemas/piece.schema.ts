import { Schema } from 'mongoose';

export const PieceSchema = new Schema({
  title: String,
  composer: String,
  arranger: String,
  duration: Number,
  code: String,
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
});
