"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState, useEffect, createContext, useContext } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn, simpleMatchText } from "@/lib/utils";
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
  SeatListResType,
  SeatSchemaType,
} from "@/schemaValidations/seat.schema";
import { useGetSeatByCarriageQuery } from "@/queries/useCarriage";
import { useDeleteSeatMutation } from "@/queries/useSeat";
import { SeatStatusValues, SeatTypeValues } from "@/constants/type";
import TableSkeleton from "@/components/Skeleton";
import { UpdateSeat } from "../seats/update-seat";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EnhancedSeatType = SeatSchemaType & {
  onUpdate: (seat: SeatSchemaType) => void;
};

const SeatDialogContext = createContext<{
  seatDelete: SeatSchemaType | null;
  setSeatDelete: (value: SeatSchemaType | null) => void;
}>({
  seatDelete: null,
  setSeatDelete: () => {},
});

function DeleteSeatDialog({
  seatDelete,
  setSeatDelete,
  onDelete,
}: {
  seatDelete: SeatSchemaType | null;
  setSeatDelete: (value: SeatSchemaType | null) => void;
  onDelete: (seatId: number) => Promise<void>;
}) {
  const t = useTranslations("ManageSeat");

  const handleDelete = async () => {
    if (seatDelete) {
      await onDelete(seatDelete.seatId);
      setSeatDelete(null);
    }
  };

  return (
    <AlertDialog
      open={Boolean(seatDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setSeatDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Del")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Deldes")}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {seatDelete?.seatId}
            </span>{" "}
            {t("DelDes2")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const columns: ColumnDef<EnhancedSeatType>[] = [
  {
    accessorKey: "seatId",
    header: ({ column }) => {
      const t = useTranslations("ManageSeat");
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("ID")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "seatStatus",
    header: ({ column }) => {
      const t = useTranslations("ManageSeat");
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Status")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const t = useTranslations("ManageSeat");
      const status = row.getValue("seatStatus") as string;
      return t(`Status_${status}`);
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId);
      return value === filterValue;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      const t = useTranslations("ManageSeat");
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Price")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `${row.getValue("price")}đ`,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.getValue(columnId) as number;
      return value >= Number(filterValue);
    },
  },
  {
    accessorKey: "seatType",
    header: ({ column }) => {
      const t = useTranslations("ManageSeat");
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Type")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const t = useTranslations("ManageSeat");
      const type = row.getValue("seatType") as string;
      return t(`Type_${type}`);
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId);
      return value === filterValue;
    },
  },
  {
    accessorKey: "ticket.ticketId",
    id: "ticketId",
    header: ({ column }) => {
      const t = useTranslations("ManageSeat");
      return <div>{t("Ticket")}</div>;
    },
    cell: ({ row }) => row.original.ticket?.ticketId ?? "N/A",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.original.ticket?.ticketId?.toString() ?? "";
      return simpleMatchText(value, filterValue);
    },
  },
  {
    id: "actions",
    header: () => {
      const t = useTranslations("ManageSeat");
      return <div>{t("Actions")}</div>;
    },
    cell: ({ row }) => {
      const t = useTranslations("ManageSeat");
      const { setSeatDelete } = useContext(SeatDialogContext);
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => row.original.onUpdate(row.original)}
            >
              {t("Update")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeatDelete(row.original)}>
              {t("Delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const PAGE_SIZE = 10;

export function CarriageIdForSeat({
  id,
  setId,
  onSubmitSuccess,
}: {
  id: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const t = useTranslations("ManageSeat");
  const paginationT = useTranslations("Pagination");
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const seatPage = searchParams.get("seatPage")
    ? Number(searchParams.get("seatPage"))
    : 1;
  const pageIndex = seatPage - 1;

  const [open, setOpen] = useState(!!id);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selectedSeat, setSelectedSeat] = useState<SeatSchemaType | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [seatDelete, setSeatDelete] = useState<SeatSchemaType | null>(null);

  // Fetch seat list for the given carriage
  const seatQuery = useGetSeatByCarriageQuery({
    id: id!,
    enabled: !!id,
    page: seatPage,
    size: pageSize,
  });
  const deleteSeatMutation = useDeleteSeatMutation();
  const data = seatQuery.data?.payload?.data.result ?? [];
  const totalItems = seatQuery.data?.payload?.data.meta?.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handle seat deletion
  const handleDeleteSeat = async (seatId: number) => {
    try {
      await deleteSeatMutation.mutateAsync(seatId);
      toast({
        title: t("DeleteSuccess"),
        description: t("SeatDeleted", { seatId }),
      });
      seatQuery.refetch();
    } catch (error) {
      toast({
        title: t("DeleteFailed"),
        description: t("Error_Generic"),
        variant: "destructive",
      });
    }
  };

  // Add onUpdate handler to each seat item
  const enhancedData: EnhancedSeatType[] = data.map((seat) => ({
    ...seat,
    onUpdate: (seat: SeatSchemaType) => {
      setSelectedSeat(seat);
      setOpenUpdateModal(true);
    },
  }));

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: enhancedData,
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

  // Sync table pagination with seatPage
  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [table, pageIndex]);

  // Reset pagination when dialog opens
  useEffect(() => {
    if (open) {
      table.setPagination({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
      });
      const params = new URLSearchParams(searchParams.toString());
      params.delete("seatPage");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [open, table, router, pathname, searchParams]);

  // Sync dialog open state with id prop
  useEffect(() => {
    setOpen(!!id);
  }, [id]);

  // Handle dialog close
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setId(undefined);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("seatPage");
      router.push(`${pathname}?${params.toString()}`);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }
  };

  // Handle page navigation
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("seatPage", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <SeatDialogContext.Provider
      value={{
        seatDelete,
        setSeatDelete,
      }}
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {t("SeatListDescription", { carriageId: id || "" })}
            </DialogTitle>
          </DialogHeader>
          <div>
            {seatQuery.isLoading ? (
              <TableSkeleton />
            ) : seatQuery.error ? (
              <div className="text-red-500">
                {t(
                  seatQuery.error.message === "Failed to fetch seats"
                    ? "Error_FetchSeats"
                    : "Error_Generic"
                )}
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center py-4 gap-5">
                  <Input
                    placeholder={t("FilterTicket")}
                    value={
                      (table
                        .getColumn("ticketId")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn("ticketId")
                        ?.setFilterValue(event.target.value)
                    }
                    className="w-[120px]"
                  />
                  <Input
                    type="number"
                    placeholder={t("FilterPrice")}
                    value={
                      (table.getColumn("price")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn("price")
                        ?.setFilterValue(event.target.value)
                    }
                    className="w-[120px]"
                  />
                  <Select
                    value={
                      (table
                        .getColumn("seatStatus")
                        ?.getFilterValue() as string) ?? "all"
                    }
                    onValueChange={(value) =>
                      table
                        .getColumn("seatStatus")
                        ?.setFilterValue(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder={t("FilterStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All")}</SelectItem>
                      {SeatStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`Status_${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={
                      (table
                        .getColumn("seatType")
                        ?.getFilterValue() as string) ?? "all"
                    }
                    onValueChange={(value) =>
                      table
                        .getColumn("seatType")
                        ?.setFilterValue(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder={t("FilterType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All")}</SelectItem>
                      {SeatTypeValues.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`Type_${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className={cn("cursor-pointer")}
                          >
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
                            {t("NoSeats")}
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
                        <SelectItem value="60">60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <DeleteSeatDialog
        seatDelete={seatDelete}
        setSeatDelete={setSeatDelete}
        onDelete={handleDeleteSeat}
      />
      {selectedSeat && (
        <UpdateSeat
          seat={selectedSeat}
          open={openUpdateModal}
          onOpenChange={setOpenUpdateModal}
          onSuccess={() => {
            seatQuery.refetch();
            setSelectedSeat(null);
          }}
        />
      )}
    </SeatDialogContext.Provider>
  );
}
