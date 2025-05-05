//////----------------------
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStationList } from "@/queries/useStation";

interface SearchData {
  departureStation: string | null;
  arrivalStation: string | null;
  tripType: string | null;
  departureDate: string | null;
  returnDate: string | null;
}

interface SearchTicketProps {
  onSearch?: (searchData: SearchData) => void;
}

export default function SearchTicket({ onSearch }: SearchTicketProps) {
  const t = useTranslations("SearchTicket");
  const router = useRouter();
  const [tripType, setTripType] = useState<string>("one-way");
  const [departureStation, setDepartureStation] = useState<string | null>(null);
  const [arrivalStation, setArrivalStation] = useState<string | null>(null);
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch station list
  const { data: stationData, isLoading: isStationLoading } = useGetStationList(
    1,
    100
  );
  const stations = stationData?.payload?.data?.result || [];

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Log form state for debugging
    console.log("Form submission state:", {
      departureStation,
      arrivalStation,
      departureDate,
      tripType,
      returnDate,
    });

    // Validate required fields
    if (!departureStation) {
      setError(t("DepartureStationRequired"));
      return;
    }
    if (!arrivalStation) {
      setError(t("ArrivalStationRequired"));
      return;
    }
    if (!departureDate) {
      setError(t("DepartureDateRequired"));
      return;
    }
    if (departureStation === arrivalStation) {
      setError(t("SameStationError"));
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      setError(t("ReturnDateRequired"));
      return;
    }

    // Validate departure date is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (departureDate < today) {
      setError(t("DepartureDatePastError"));
      return;
    }

    const searchData: SearchData = {
      departureStation,
      arrivalStation,
      tripType,
      departureDate,
      returnDate: tripType === "one-way" ? null : returnDate,
    };

    if (onSearch) {
      onSearch(searchData);
    }

    const query = new URLSearchParams({
      ...(searchData.departureStation && {
        departureStation: searchData.departureStation,
      }),
      ...(searchData.arrivalStation && {
        arrivalStation: searchData.arrivalStation,
      }),
      ...(searchData.tripType && { tripType: searchData.tripType }),
      ...(searchData.departureDate && {
        departureDate: searchData.departureDate,
      }),
      ...(searchData.returnDate && { returnDate: searchData.returnDate }),
    }).toString();

    setError(null);
    router.push(`/search?${query}`);
  };

  const isFormValid =
    departureStation &&
    arrivalStation &&
    departureDate &&
    departureStation !== arrivalStation &&
    departureDate >= new Date().toISOString().split("T")[0] &&
    (tripType === "one-way" || (tripType === "round-trip" && returnDate));

  return (
    <form onSubmit={handleSearch}>
      <div>
        <div className="text-base font-semibold border-b pb-2 mb-2">
          {t("JourneyInfo")}
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium">
              {t("DepartureStation")}
            </label>
            <Select
              onValueChange={setDepartureStation}
              value={departureStation || ""}
              disabled={isStationLoading}
            >
              <SelectTrigger className="w-full mt-1 text-sm">
                <SelectValue placeholder={t("DepartureStationPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem
                    key={station.stationId}
                    value={station.stationName}
                  >
                    {station.stationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("ArrivalStation")}
            </label>
            <Select
              onValueChange={setArrivalStation}
              value={arrivalStation || ""}
              disabled={isStationLoading}
            >
              <SelectTrigger className="w-full mt-1 text-sm">
                <SelectValue placeholder={t("ArrivalStationPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem
                    key={station.stationId}
                    value={station.stationName}
                  >
                    {station.stationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">{t("TripType")}</label>
            <div className="flex items-center space-x-3 mt-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={tripType === "one-way"}
                  onChange={() => setTripType("one-way")}
                />
                <span className="text-sm">{t("OneWay")}</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="tripType"
                  value="round-trip"
                  checked={tripType === "round-trip"}
                  onChange={() => setTripType("round-trip")}
                />
                <span className="text-sm">{t("RoundTrip")}</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("DepartureDate")}
            </label>
            <Input
              name="departureDate"
              type="date"
              className="w-full mt-1 text-sm"
              placeholder={t("DepartureDatePlaceholder")}
              onChange={(e) => {
                console.log("Selected departure date:", e.target.value);
                setDepartureDate(e.target.value);
              }}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              {t("ReturnDate")}
            </label>
            <Input
              name="returnDate"
              type="date"
              className="w-full mt-1 text-sm"
              placeholder={t("ReturnDatePlaceholder")}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled={tripType === "one-way"}
              min={departureDate || new Date().toISOString().split("T")[0]}
              required={tripType === "round-trip"}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700"
            disabled={isStationLoading || !isFormValid}
          >
            {t("Search")}
          </Button>
        </div>
      </div>
    </form>
  );
}
