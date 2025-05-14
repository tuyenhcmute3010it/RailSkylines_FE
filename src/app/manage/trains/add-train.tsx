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
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainStatus, TrainStatusValues } from "@/constants/type";
import {
  CreateTrainBody,
  CreateTrainBodyType,
} from "@/schemaValidations/train.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useAddTrainMutation } from "@/queries/useTrain";

export default function AddTrain() {
  const addTrainMutation = useAddTrainMutation();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTrainBodyType>({
    resolver: zodResolver(CreateTrainBody),
    defaultValues: {
      trainName: "",
      trainStatus: TrainStatus.Active,
    },
  });
  const reset = () => {
    form.reset();
  };
  const onSubmit = async (values: CreateTrainBodyType) => {
    if (addTrainMutation.isPending) return;
    try {
      let body = values;
      const result = await addTrainMutation.mutateAsync(body);
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
          <span>Add Train</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Train</DialogTitle>
          <DialogDescription>
            Enter the details of the new carriage.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-carriage-form"
            className="grid gap-4 py-4"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
          >
            <FormField
              control={form.control}
              name="trainName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="trainName">Train Name</Label>
                  <Input id="trainName" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainStatus"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="description">Trạng thái</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TrainStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-carriage-form">
            Add Train
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
