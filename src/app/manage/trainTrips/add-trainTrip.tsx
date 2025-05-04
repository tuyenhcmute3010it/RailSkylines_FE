"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTrainTripBody,
  CreateTrainTripBodyType,
} from "@/schemaValidations/trainTrip.schema";
import { useAddTrainTripMutation } from "@/queries/useTrainTrip";
import { TrainDialog } from "../carriages/train-dialog";
import Select from "react-select";
import stationsApiRequest from "@/apiRequests/station";
import { StationListResType } from "@/schemaValidations/station.schema";

export default function AddTrainTrip() {
  const addTrainTripMutation = useAddTrainTripMutation();
  const [open, setOpen] = useState(false);
  const [selectedTrainName, setSelectedTrainName] = useState<string>("");
  const [stations, setStations] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedStations, setSelectedStations] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedOriginStation, setSelectedOriginStation] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const form = useForm<CreateTrainTripBodyType>({
    resolver: zodResolver(CreateTrainTripBody),
    defaultValues: {
      trainId: 0,
      originStationName: "",
      journeyStationNames: [],
      departureTime: "",
      arrivalTime: "",
    },
  });

  // Fetch stations from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await stationsApiRequest.listStation(1, 100); // Lấy tối đa 100 stations
        const stationList = response.payload.data.result;
        const stationOptions = stationList.map((station) => ({
          label: station.stationName,
          value: station.stationName,
        }));
        setStations(stationOptions);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
      }
    };
    fetchStations();
  }, []);

  const reset = () => {
    form.reset();
    setSelectedStations([]);
    setSelectedOriginStation(null);
    setSelectedTrainName("");
  };

  const handleStationChange = (selectedOptions: any) => {
    setSelectedStations(selectedOptions || []);
    form.setValue(
      "journeyStationNames",
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
  };

  const handleOriginStationChange = (selectedOption: any) => {
    setSelectedOriginStation(selectedOption);
    form.setValue(
      "originStationName",
      selectedOption ? selectedOption.value : ""
    );
  };

  const onSubmit = async (values: CreateTrainTripBodyType) => {
    if (addTrainTripMutation.isPending) return;
    try {
      const body = {
        ...values,
        trainId: Number(values.trainId), // Ensure trainId is a number
      };

      const result = await addTrainTripMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Train Trip</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Train Trip</DialogTitle>
          <DialogDescription>
            Enter the details of the new train trip.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-train-trip-form"
            className="grid gap-4 py-4"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
          >
            <FormField
              control={form.control}
              name="trainId"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel htmlFor="train">Choose Train</FormLabel>
                    <div className="col-span-3 w-full space-y-2">
                      <div>{selectedTrainName || "No train selected"}</div>
                      <TrainDialog
                        onChoose={(train) => {
                          form.setValue("trainId", train.trainId);
                          setSelectedTrainName(train.trainName);
                        }}
                      />
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originStationName"
              render={() => (
                <FormItem>
                  <FormLabel>Origin Station</FormLabel>
                  <FormControl>
                    <Select
                      options={stations}
                      value={selectedOriginStation}
                      onChange={handleOriginStationChange}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      placeholder="Select origin station..."
                      className="basic-single-select"
                      classNamePrefix="select"
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
                  <FormLabel>Journey Stations</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      options={stations}
                      value={selectedStations}
                      onChange={handleStationChange}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      placeholder="Select journey stations..."
                      className="basic-multi-select"
                      classNamePrefix="select"
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
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input id="departureTime" type="datetime-local" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrivalTime"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input id="arrivalTime" type="datetime-local" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-train-trip-form">
            Add Train Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
