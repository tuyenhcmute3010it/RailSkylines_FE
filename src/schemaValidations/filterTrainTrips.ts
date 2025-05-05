export type TrainTrip = {
  trainTripId: number;
  train: { trainId: number; trainName: string; trainStatus: string };
  route: {
    routeId: number;
    originStation: { stationId: number; stationName: string; position: number };
    journey: { stationId: number; stationName: string; position: number }[];
  };
  schedule: {
    scheduleId: number;
    departure: {
      clockTimeId: number;
      date: string;
      hour: number;
      minute: number;
    };
    arrival: {
      clockTimeId: number;
      date: string;
      hour: number;
      minute: number;
    };
  };
};

export interface SearchData {
  departureStation: string | null;
  arrivalStation: string | null;
  tripType: string | null;
  departureDate: string | null;
  returnDate: string | null;
}

export function filterTrainTrips(
  trips: TrainTrip[],
  searchData: SearchData
): TrainTrip[] {
  return trips.filter((trip) => {
    const { departureStation, arrivalStation, departureDate } = searchData;

    // Departure station filter
    if (departureStation) {
      const depMatch = trip.route.originStation.stationName
        .toLowerCase()
        .includes(departureStation.toLowerCase());
      if (!depMatch) return false;
    }

    // Arrival station filter
    if (arrivalStation) {
      const journeyStations = [
        ...trip.route.journey.map((j) => j.stationName),
        trip.route.originStation.stationName, // Include origin as possible destination
      ];
      const arrMatch = journeyStations.some((station) =>
        station.toLowerCase().includes(arrivalStation.toLowerCase())
      );
      if (!arrMatch) return false;
    }

    // Departure date filter
    if (departureDate) {
      const tripDate = new Date(trip.schedule.departure.date)
        .toISOString()
        .split("T")[0];
      if (tripDate !== departureDate) return false;
    }

    return true;
  });
}
