"use client";

import {
  CaretSortIcon,
  DotsHorizontalIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, createContext, useContext, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainDialog } from "./train-dialog";
import AutoPagination from "@/components/auto-pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";
import AddCarriage from "./add-carriage";
import EditCarriage from "./edit-carriage";

// Định nghĩa type cho Carriage
type Carriage = {
  id: number;
  carriageNumber: string;
  trainNumber: string;
  capacity: number;
  type: string;
};

const CarriageTableContext = createContext<{
  setCarriageIdEdit: (value: number) => void;
  carriageIdEdit: number | undefined;
  carriageDelete: Carriage | null;
  setCarriageDelete: (value: Carriage | null) => void;
}>({
  setCarriageIdEdit: (value: number | undefined) => {},
  carriageIdEdit: undefined,
  carriageDelete: null,
  setCarriageDelete: (value: Carriage | null) => {},
});

// Component dialog thêm/sửa carriage
function CarriageDialog({
  carriageId,
  onSubmitSuccess,
}: {
  carriageId?: number;
  onSubmitSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      trainNumber: "",
      carriageNumber: "",
      capacity: "",
      type: "",
    },
  });

  const CarriageTypes = [
    { value: "soft_seat_ac", label: "Soft Seat with AC" },
    { value: "hard_seat", label: "Hard Seat" },
    { value: "soft_bed_6", label: "Soft Berth (6 Beds)" },
    { value: "soft_bed_4", label: "Soft Berth (4 Beds)" },
  ];

  const onSubmit = (data: any) => {
    // Xử lý submit form (thêm hoặc cập nhật)
    console.log(data);
    setOpen(false);
    onSubmitSuccess();
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="carriage-form"
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="carriageNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carriage Number</FormLabel>
                  <Input id="carriageNumber" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>Choose Train</FormLabel>
                    <div className="col-span-3 w-full space-y-2">
                      <div className="flex items-center gap-4">
                        <div>{field.value}</div>
                        <TrainDialog
                          onChoose={(train) => {
                            field.onChange(train.name);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <Input id="capacity" type="number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>Type of Carriage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="col-span-3">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Type Carriage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CarriageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="carriage-form">
            {carriageId ? "Update Carriage" : "Add Carriage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component xác nhận xóa
function DeleteCarriageDialog({
  carriageDelete,
  setCarriageDelete,
}: {
  carriageDelete: Carriage | null;
  setCarriageDelete: (value: Carriage | null) => void;
}) {
  return (
    <AlertDialog
      open={Boolean(carriageDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setCarriageDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Carriage</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete carriage{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {carriageDelete?.carriageNumber}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function CarriageTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [carriageIdEdit, setCarriageIdEdit] = useState<number | undefined>();
  const [carriageDelete, setCarriageDelete] = useState<Carriage | null>(null);

  // Dữ liệu mẫu
  const data: Carriage[] = [
    {
      id: 1,
      carriageNumber: "C001",
      trainNumber: "SE1",
      capacity: 50,
      type: "soft_seat_ac",
    },
    {
      id: 2,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 3,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 4,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 5,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 6,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 7,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 2,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 2,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 2,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 2,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    {
      id: 2,
      carriageNumber: "C002",
      trainNumber: "SE2",
      capacity: 60,
      type: "hard_seat",
    },
    // Thêm dữ liệu mẫu khác nếu cần
  ];

  const columns: ColumnDef<Carriage>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "carriageNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Carriage Number
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "trainNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Train Number
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },

    {
      accessorKey: "capacity",
      header: "Capacity",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const carriageType = [
          { value: "soft_seat_ac", label: "Soft Seat with AC" },
          { value: "hard_seat", label: "Hard Seat" },
          { value: "soft_bed_6", label: "Soft Berth (6 Beds)" },
          { value: "soft_bed_4", label: "Soft Berth (4 Beds)" },
        ].find((t) => t.value === type)?.label;
        return <div>{carriageType}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setCarriageIdEdit, setCarriageDelete } =
          useContext(CarriageTableContext);
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCarriageIdEdit(row.original.id)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCarriageDelete(row.original)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <CarriageTableContext.Provider
      value={{
        carriageIdEdit,
        setCarriageIdEdit,
        carriageDelete,
        setCarriageDelete,
      }}
    >
      <div className="w-full">
        {/* <EditCarriage
          id={carriageIdEdit}
          setId={setCarriageIdEdit}
          onSubmitSuccess={() => {}}
        /> */}
        <EditCarriage
          id={carriageIdEdit}
          setId={setCarriageIdEdit}
          onSubmitSuccess={() => setCarriageIdEdit(undefined)}
        />
        <DeleteCarriageDialog
          carriageDelete={carriageDelete}
          setCarriageDelete={setCarriageDelete}
        />
        <div className="flex items-center py-4 gap-5">
          <Input
            placeholder="Filter carriage numbers..."
            value={
              (table.getColumn("carriageNumber")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("carriageNumber")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-100"
          />
          <Input
            placeholder="Filter Train numbers..."
            value={
              (table.getColumn("trainNumber")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("trainNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-100"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddCarriage />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4 ">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
            of <strong>{data.length}</strong> carriages
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/carriages"
            />
          </div>
        </div>
      </div>
    </CarriageTableContext.Provider>
  );
}
