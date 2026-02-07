import { Availability } from './avaliablity.model';

const normalizeDate = (date: string) => {
  return new Date(date.split('T')[0]);
};

const setAvailability = async (
  artistId: string,
  date: string,
  slots: any[],
) => {
  const normalizedDate = normalizeDate(date);

  return await Availability.findOneAndUpdate(
    {
      artist: artistId,
      date: normalizedDate,
    },
    {
      artist: artistId,
      date: normalizedDate,
      slots,
    },
    { new: true, upsert: true },
  );
};

const getAvailability = async (artistId: string, date: string) => {
  const normalizedDate = normalizeDate(date);

  return await Availability.findOne({
    artist: artistId,
    date: normalizedDate,
  });
};

export const AvailabilityService = {
  setAvailability,
  getAvailability,
};
