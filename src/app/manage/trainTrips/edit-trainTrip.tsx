"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Select from "react-select";
import stationsApiRequest from "@/apiRequests/station";
import {
  UpdateTrainTripBody,
  UpdateTrainTripBodyType,
} from "@/schemaValidations/trainTrip.schema";
import {
  useGetTrainTrip,
  useUpdateTrainTripMutation,
} from "@/queries/useTrainTrip";
import { TrainDialog } from "../carriages/train-dialog";
import { Loader2 } from "lucide-react";

export default function EditTrainTrip({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const t = useTranslations("TrainTrip");
  const { data, isLoading: isLoadingTrip } = useGetTrainTrip({
    id: id as number,
    enabled: Boolean(id),
  });
  const updateTrainTripMutation = useUpdateTrainTripMutation();
  const [stations, setStations] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedOriginStation, setSelectedOriginStation] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedJourneyStations, setSelectedJourneyStations] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedTrainName, setSelectedTrainName] = useState<string>("");
  const [isLoadingStations, setIsLoadingStations] = useState(false);

  const form = useForm<UpdateTrainTripBodyType>({
    resolver: zodResolver(UpdateTrainTripBody),
    defaultValues: {
      trainId: 0,
      originStationName: "",
      journeyStationNames: [],
      departureTime: "",
      arrivalTime: "",
    },
  });

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoadingStations(true);
      try {
        const response = await stationsApiRequest.listStation(1, 100);
        const stationList = response.payload.data.result;
        const stationOptions = stationList.map((station) => ({
          label: station.stationName,
          value: station.stationName,
        }));
        setStations(stationOptions);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
        toast({
          variant: "destructive",
          description: t("ErrorFetchingStations"),
        });
      } finally {
        setIsLoadingStations(false);
      }
    };
    fetchStations();
  }, [t]);

  // Populate form with fetched data
  useEffect(() => {
    if (data) {
      const { train, route, schedule } = data.payload.data;
      const journeyStations = route.journey.map(
        (station) => station.stationName
      );
      form.reset({
        trainId: train.trainId,
        originStationName: route.originStation.stationName,
        journeyStationNames: journeyStations,
        departureTime: new Date(schedule.departure.date)
          .toISOString()
          .slice(0, 16),
        arrivalTime: new Date(schedule.arrival.date).toISOString().slice(0, 16),
      });
      setSelectedTrainName(train.trainName);
      setSelectedOriginStation({
        label: route.originStation.stationName,
        value: route.originStation.stationName,
      });
      setSelectedJourneyStations(
        journeyStations.map((station) => ({
          label: station,
          value: station,
        }))
      );
    }
  }, [data, form]);

  // Filter journey stations to exclude origin station
  const journeyStationOptions = stations.filter(
    (station) => station.value !== selectedOriginStation?.value
  );

  const reset = () => {
    form.reset({
      trainId: 0,
      originStationName: "",
      journeyStationNames: [],
      departureTime: "",
      arrivalTime: "",
    });
    setSelectedTrainName("");
    setSelectedOriginStation(null);
    setSelectedJourneyStations([]);
    setId(undefined);
  };

  const handleOriginStationChange = (selectedOption: any) => {
    setSelectedOriginStation(selectedOption);
    form.setValue(
      "originStationName",
      selectedOption ? selectedOption.value : ""
    );
    // Remove the new origin station from journey stations if present
    const filteredJourneyStations = selectedJourneyStations.filter(
      (station) => station.value !== selectedOption?.value
    );
    setSelectedJourneyStations(filteredJourneyStations);
    form.setValue(
      "journeyStationNames",
      filteredJourneyStations.map((station) => station.value)
    );
  };

  const handleJourneyStationsChange = (selectedOptions: any) => {
    setSelectedJourneyStations(selectedOptions || []);
    form.setValue(
      "journeyStationNames",
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
  };

  const onSubmit = async (values: UpdateTrainTripBodyType) => {
    if (updateTrainTripMutation.isPending) return;
    if (values.trainId === 0) {
      form.setError("trainId", { message: t("TrainRequired") });
      return;
    }
    try {
      const body: UpdateTrainTripBodyType & { id: number } = {
        id: id as number,
        ...values,
      };
      const result = await updateTrainTripMutation.mutateAsync(body);
      toast({
        description: result.payload.message || t("TrainTripUpdated"),
      });
      reset();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("UpdateTrainTrip")}</DialogTitle>
          <DialogDescription>{t("UpdateTrainTripDesc")}</DialogDescription>
        </DialogHeader>
        {isLoadingTrip || isLoadingStations ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              noValidate
              className="grid gap-4 py-4"
              id="edit-train-trip-form"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form errors:", errors);
              })}
            >
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <FormLabel>{t("TrainTripId")}</FormLabel>
                  <div className="col-span-3 w-full space-y-2">
                    <Input
                      type="number"
                      value={id || 0}
                      readOnly
                      className="w-full"
                    />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="trainId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <FormLabel>{t("Train")}</FormLabel>
                      <div className="col-span-3 w-full space-y-2">
                        <div>{selectedTrainName || t("NoTrainSelected")}</div>
                        <TrainDialog
                          onChoose={(train) => {
                            form.setValue("trainId", train.trainId);
                            setSelectedTrainName(train.trainName);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originStationName"
                render={() => (
                  <FormItem>
                    <FormLabel>{t("OriginStation")}</FormLabel>
                    <FormControl>
                      <Select
                        options={stations}
                        value={selectedOriginStation}
                        onChange={handleOriginStationChange}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        placeholder={t("SelectOriginStation")}
                        className="basic-single-select"
                        classNamePrefix="select"
                        isDisabled={stations.length === 0 || isLoadingStations}
                        isClearable
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="journeyStationNames"
                render={() => (
                  <FormItem>
                    <FormLabel>{t("JourneyStations")}</FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        options={journeyStationOptions}
                        value={selectedJourneyStations}
                        onChange={handleJourneyStationsChange}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        placeholder={t("SelectJourneyStations")}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isDisabled={stations.length === 0 || isLoadingStations}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("DepartureTime")}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ArrivalTime")}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={reset}
                disabled={updateTrainTripMutation.isPending}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                form="edit-train-trip-form"
                disabled={
                  updateTrainTripMutation.isPending ||
                  isLoadingTrip ||
                  isLoadingStations
                }
              >
                {updateTrainTripMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("Submitting")}
                  </>
                ) : (
                  t("Save")
                )}
              </Button>
            </DialogFooter>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
