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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, createContext, useContext, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import TableSkeleton from "@/components/Skeleton";
import {
  useDeleteTrainTripMutation,
  useGetTrainTripList,
} from "@/queries/useTrainTrip";
import { TrainTripListResType } from "@/schemaValidations/trainTrip.schema";
import AddTrainTrip from "./add-trainTrip";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import EditTrainTrip from "./edit-trainTrip";

type TrainTripItem = TrainTripListResType["data"]["result"][0];

const TrainTripTableContext = createContext<{
  setTrainTripIdEdit: (value: number | undefined) => void;
  trainTripIdEdit: number | undefined;
  trainTripDelete: TrainTripItem | null;
  setTrainTripDelete: (value: TrainTripItem | null) => void;
}>({
  setTrainTripIdEdit: () => {},
  trainTripIdEdit: undefined,
  trainTripDelete: null,
  setTrainTripDelete: () => {},
});

function DeleteTrainTripDialog({
  trainTripDelete,
  setTrainTripDelete,
}: {
  trainTripDelete: TrainTripItem | null;
  setTrainTripDelete: (value: TrainTripItem | null) => void;
}) {
  const t = useTranslations("TrainTrip");
  const deleteTrainTripMutation = useDeleteTrainTripMutation();

  const deleteTrainTrip = async () => {
    if (trainTripDelete) {
      try {
        await deleteTrainTripMutation.mutateAsync(trainTripDelete.trainTripId);
        setTrainTripDelete(null);
        toast({
          description: t("TrainTripDeleted", {
            id: trainTripDelete.trainTripId,
          }),
        });
      } catch (error) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(trainTripDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTrainTripDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DeleteTrainTrip")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("DeleteTrainTripDesc", {
              id: trainTripDelete?.trainTripId,
            })}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {trainTripDelete?.trainTripId}
            </span>{" "}
            {t("DeleteTrainTripDesc2")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTrainTrip}>
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function TrainTripTable() {
  const t = useTranslations("TrainTrip");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageIndex = page - 1;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [trainTripIdEdit, setTrainTripIdEdit] = useState<number | undefined>();
  const [trainTripDelete, setTrainTripDelete] = useState<TrainTripItem | null>(
    null
  );

  const trainTripListQuery = useGetTrainTripList(page, pageSize);
  const data = trainTripListQuery.data?.payload.data.result ?? [];
  const totalItems = trainTripListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const columns: ColumnDef<TrainTripItem>[] = [
    {
      accessorKey: "trainTripId",
      id: "trainTripId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("TrainTripId")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "train.trainId",
      id: "trainId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("TrainId")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.train.trainId,
    },
    {
      accessorKey: "route.originStation.stationName",
      id: "originStation",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("OriginStation")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.route.originStation.stationName,
    },
    {
      accessorKey: "route.journey",
      id: "journeyStations",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("JourneyStations")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        row.original.route.journey.map((s) => s.stationName).join(", ") || "-",
      filterFn: (row, columnId, filterValue) => {
        const journey = row.original.route.journey
          .map((s) => s.stationName)
          .join(", ");
        return journey.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "schedule.departure.date",
      id: "departureTime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("DepartureTime")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.schedule.departure.date).toLocaleString(),
    },
    {
      accessorKey: "schedule.arrival.date",
      id: "arrivalTime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("ArrivalTime")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.schedule.arrival.date).toLocaleString(),
    },
    {
      id: "actions",
      header: t("Action"),
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setTrainTripIdEdit, setTrainTripDelete } = useContext(
          TrainTripTableContext
        );
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Action")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTrainTripIdEdit(row.original.trainTripId)}
              >
                {t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTrainTripDelete(row.original)}
              >
                {t("Delete")}
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    pageCount: totalPages,
    manualPagination: true,
  });

  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [table, pageIndex]);

  const goToPage = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, totalPages));
    if (clampedPage !== page) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", clampedPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <TrainTripTableContext.Provider
      value={{
        trainTripIdEdit,
        setTrainTripIdEdit,
        trainTripDelete,
        setTrainTripDelete,
      }}
    >
      <div className="w-full">
        <EditTrainTrip
          id={trainTripIdEdit}
          setId={setTrainTripIdEdit}
          onSubmitSuccess={() => {
            setTrainTripIdEdit(undefined);
            trainTripListQuery.refetch();
          }}
        />
        <DeleteTrainTripDialog
          trainTripDelete={trainTripDelete}
          setTrainTripDelete={setTrainTripDelete}
        />
        {trainTripListQuery.isLoading ? (
          <TableSkeleton />
        ) : trainTripListQuery.error ? (
          <div className="text-red-500">
            {t("Error")}: {trainTripListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder={t("FilterTrainId")}
                value={
                  (table.getColumn("trainId")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("trainId")?.setFilterValue(event.target.value)
                }
                className="w-72"
              />
              <Input
                placeholder={t("FilterOriginStation")}
                value={
                  (table
                    .getColumn("originStation")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("originStation")
                    ?.setFilterValue(event.target.value)
                }
                className="w-72"
              />
              <Input
                placeholder={t("FilterJourneyStations")}
                value={
                  (table
                    .getColumn("journeyStations")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("journeyStations")
                    ?.setFilterValue(event.target.value)
                }
                className="w-72"
              />
              <div className="ml-auto flex items-center gap-2">
                <AddTrainTrip />
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
                        {t("NoResults")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="text-xs text-muted-foreground">
                {paginationT("Pagi1")}{" "}
                <strong>{table.getRowModel().rows.length}</strong>{" "}
                {paginationT("Pagi2")} <strong>{totalItems}</strong>{" "}
                {paginationT("Pagi3")}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  {paginationT("Previous")}
                </Button>
                <span>
                  {paginationT("Page")} {page} {paginationT("Of")} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  {paginationT("Next")}
                </Button>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    goToPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={paginationT("RowsPerPage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </div>
    </TrainTripTableContext.Provider>
  );
}
