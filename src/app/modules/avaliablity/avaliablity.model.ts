// availability.model.ts
import { Schema, model } from 'mongoose';

const slotSchema = new Schema({
  time: { type: String, required: true }, // e.g. "10:00"
  isBooked: { type: Boolean, default: false },
});

const availabilitySchema = new Schema(
  {
    artist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // store in YYYY-MM-DD
    slots: [slotSchema],
  },
  { timestamps: true }
);

export const Availability = model('Availability', availabilitySchema);
