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
import { useState, createContext, useContext, useEffect } from "react";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import AddCarriage from "./add-carriage";
import EditCarriage from "./edit-carriage";
import {
  CarriageListResType,
  CarriageSchemaType,
} from "@/schemaValidations/carriage.schema";
import { useGetCarriageList } from "@/queries/useCarriage";
import { CarriageTypesValues } from "@/constants/type";
import TableSkeleton from "@/components/Skeleton";
import { CarriageIdForSeat } from "./seatForCarriage";

type CarriageItem = CarriageSchemaType;

const CarriageTableContext = createContext<{
  setCarriageIdEdit: (value: number | undefined) => void;
  carriageIdEdit: number | undefined;
  carriageDelete: CarriageItem | null;
  setCarriageDelete: (value: CarriageItem | null) => void;
  setCarriageIdForSeats: (value: number | undefined) => void;
  carriageIdForSeats: number | undefined;
}>({
  setCarriageIdEdit: () => {},
  carriageIdEdit: undefined,
  carriageDelete: null,
  setCarriageDelete: () => {},
  setCarriageIdForSeats: () => {},
  carriageIdForSeats: undefined,
});

function DeleteCarriageDialog({
  carriageDelete,
  setCarriageDelete,
}: {
  carriageDelete: CarriageItem | null;
  setCarriageDelete: (value: CarriageItem | null) => void;
}) {
  const t = useTranslations("ManageCarriage");

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
          <AlertDialogTitle>{t("Del")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Deldes")}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {carriageDelete?.carriageId}
            </span>{" "}
            {t("DelDes2")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction>{t("Continue")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function CarriageTable() {
  const t = useTranslations("ManageCarriage");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [carriageIdEdit, setCarriageIdEdit] = useState<number | undefined>();
  const [carriageDelete, setCarriageDelete] = useState<CarriageItem | null>(
    null
  );
  const [carriageIdForSeats, setCarriageIdForSeats] = useState<
    number | undefined
  >();
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Fetch carriage list
  const carriageListQuery = useGetCarriageList(page, pageSize);
  const data = carriageListQuery.data?.payload.data.result ?? [];
  const totalItems = carriageListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<CarriageItem>[] = [
    {
      accessorKey: "carriageId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("ID")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "train.trainName",
      id: "trainName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("TrainNumber")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as string;
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      },
      cell: ({ row }) => row.original.train?.trainName ?? "N/A",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Price")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `${row.getValue("price")}đ`,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as number;
        return value >= Number(filterValue);
      },
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Discount")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `${row.getValue("discount")}%`,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as number;
        return value >= Number(filterValue);
      },
    },
    {
      accessorKey: "carriageType",
      header: t("Type"),
      cell: ({ row }) => {
        const type = row.getValue("carriageType") as string;
        const carriageType = [
          { value: "seat", label: t("SoftSeatAC") },
          { value: "sixBeds", label: t("SoftBerth6") },
          { value: "fourBeds", label: t("SoftBerth4") },
        ].find((t) => t.value === type)?.label;
        return <div>{carriageType ?? type}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        const value = row.getValue(columnId);
        return value === filterValue;
      },
    },
    {
      id: "actions",
      header: t("Action"),
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setCarriageIdEdit, setCarriageDelete, setCarriageIdForSeats } =
          useContext(CarriageTableContext);
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
                onClick={() => setCarriageIdEdit(row.original.carriageId)}
              >
                {t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCarriageDelete(row.original)}>
                {t("Delete")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCarriageIdForSeats(row.original.carriageId)}
              >
                {t("ViewSeats")}
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
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <CarriageTableContext.Provider
      value={{
        carriageIdEdit,
        setCarriageIdEdit,
        carriageDelete,
        setCarriageDelete,
        carriageIdForSeats,
        setCarriageIdForSeats,
      }}
    >
      <div className="w-full">
        {carriageIdEdit !== undefined && (
          <EditCarriage
            id={carriageIdEdit}
            setId={setCarriageIdEdit}
            onSubmitSuccess={() => {
              setCarriageIdEdit(undefined);
              carriageListQuery.refetch();
            }}
          />
        )}
        {carriageIdForSeats !== undefined && (
          <CarriageIdForSeat
            id={carriageIdForSeats}
            setId={setCarriageIdForSeats}
          />
        )}
        <DeleteCarriageDialog
          carriageDelete={carriageDelete}
          setCarriageDelete={setCarriageDelete}
        />
        {carriageListQuery.isLoading ? (
          <TableSkeleton />
        ) : carriageListQuery.error ? (
          <div className="text-red-500">
            {t("Error")}: {carriageListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder={t("FilterTrainName")}
                value={
                  (table.getColumn("trainName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("trainName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                type="number"
                placeholder={t("FilterPrice")}
                value={
                  (table.getColumn("price")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("price")?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                type="number"
                placeholder={t("FilterDiscount")}
                value={
                  (table.getColumn("discount")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("discount")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Select
                value={
                  (table
                    .getColumn("carriageType")
                    ?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("carriageType")
                    ?.setFilterValue(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger className="max-w-sm w-[150px]">
                  <SelectValue placeholder={t("SelectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All")}</SelectItem>
                  {CarriageTypesValues.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "seat"
                        ? t("SoftSeatAC")
                        : type === "sixBeds"
                        ? t("SoftBerth6")
                        : t("SoftBerth4")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </CarriageTableContext.Provider>
  );
}
