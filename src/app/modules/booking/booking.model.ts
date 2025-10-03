import mongoose, { Schema, Document, model } from 'mongoose';
import { BookingModel, IBooking } from './booking.interface';

export interface IBookingDocument extends Document {
  users: mongoose.Types.ObjectId[];
  artist: mongoose.Types.ObjectId;
  price: number;
  fine?: number;
  bookingId: string;
  status: 'Pending' | 'Complete' | 'Accept' | 'Reject' | 'Refund';
  booking_date: string;
  booking_time: string;
  transactionId: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  allowMultiple: boolean;
}

const bookingSchema = new Schema<IBookingDocument, BookingModel>(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    artist: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: { type: Number, required: true },
    fine: { type: Number },
    bookingId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['Pending', 'Complete', 'Accept', 'Reject', 'Refund'],
      default: 'Pending',
    },
    booking_date: { type: String, required: true },
    booking_time: { type: String, required: true },
    transactionId: { type: String, required: true },

    // Zoom + multi-user fields
    zoomJoinUrl: { type: String },
    zoomStartUrl: { type: String },
    allowMultiple: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Booking = model<IBookingDocument, BookingModel>(
  'Booking',
  bookingSchema
);
