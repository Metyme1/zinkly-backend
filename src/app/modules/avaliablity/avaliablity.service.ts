import { Availability } from './avaliablity.model';

const setAvailability = async (
  artistId: string,
  date: string,
  slots: any[]
) => {
  return await Availability.findOneAndUpdate(
    { artist: artistId, date },
    { artist: artistId, date, slots },
    { new: true, upsert: true }
  );
};

const getAvailability = async (artistId: string, date: string) => {
  return await Availability.findOne({ artist: artistId, date });
};

export const AvailabilityService = {
  setAvailability,
  getAvailability,
};
