import { Document, Model } from 'mongoose';

export interface IBooking {
  users: string[];
  artist: string;
  price: number;
  fine?: number;
  bookingId: string;
  status?: 'Pending' | 'Complete' | 'Accept' | 'Reject' | 'Refund';
  booking_date: string;
  transactionId: string;
  booking_time: string;

  // 👇 Add Zoom + multi-user fields here
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  allowMultiple?: boolean;
}

export type BookingModel = Model<IBooking>;
