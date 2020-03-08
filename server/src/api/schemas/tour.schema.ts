import {Schema} from "mongoose";

export const TourSchema = new Schema({
  title: String,
  season: String,
  year: Number,
});
