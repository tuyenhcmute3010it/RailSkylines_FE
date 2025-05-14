"use client";

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import TableSkeleton from "@/components/Skeleton";
import {
  ResBookingHistoryDTOType,
  ResTicketHistoryDTOType,
} from "@/schemaValidations/booking.schema";
import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { useAccountProfile } from "@/queries/useAccount";

type BookingItem = ResBookingHistoryDTOType;

const BookingTableContext = createContext<{
  ticketView: ResTicketHistoryDTOType | null;
  setTicketView: (value: ResTicketHistoryDTOType | null) => void;
  bookingView: BookingItem | null;
  setBookingView: (value: BookingItem | null) => void;
}>({
  ticketView: null,
  setTicketView: () => {},
  bookingView: null,
  setBookingView: () => {},
});

function ViewTicketDialog({
  ticketView,
  setTicketView,
}: {
  ticketView: ResTicketHistoryDTOType | null;
  setTicketView: (value: ResTicketHistoryDTOType | null) => void;
}) {
  const t = useTranslations("Booking");

  return (
    <AlertDialog
      open={Boolean(ticketView)}
      onOpenChange={(value) => {
        if (!value) {
          setTicketView(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("TicketDetails")}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <p>
                <strong>{t("TicketCode")}:</strong> {ticketView?.ticketCode}
              </p>
              <p>
                <strong>{t("CitizenId")}:</strong> {ticketView?.citizenId}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Close")}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ViewBookingDialog({
  bookingView,
  setBookingView,
}: {
  bookingView: BookingItem | null;
  setBookingView: (value: BookingItem | null) => void;
}) {
  const t = useTranslations("Booking");

  return (
    <AlertDialog
      open={Boolean(bookingView)}
      onOpenChange={(value) => {
        if (!value) {
          setBookingView(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("BookingDetails")}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <p>
                <strong>{t("BookingCode")}:</strong> {bookingView?.bookingCode}
              </p>
              <p>
                <strong>{t("BookingDate")}:</strong>{" "}
                {bookingView?.date
                  ? format(new Date(bookingView.date), "dd/MM/yyyy HH:mm")
                  : "N/A"}
              </p>
              <p>
                <strong>{t("TotalPrice")}:</strong>{" "}
                {bookingView?.totalPrice.toLocaleString()} VND
              </p>
              <p>
                <strong>{t("PaymentStatus")}:</strong>{" "}
                <span
                  className={`${
                    bookingView?.paymentStatus === "success"
                      ? "text-green-600"
                      : bookingView?.paymentStatus === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {bookingView?.paymentStatus.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>{t("ContactEmail")}:</strong>{" "}
                {bookingView?.contactEmail || "N/A"}
              </p>
              <p>
                <strong>{t("ContactPhone")}:</strong>{" "}
                {bookingView?.contactPhone || "N/A"}
              </p>
              <p>
                <strong>{t("PaymentType")}:</strong>{" "}
                {bookingView?.paymentType || "N/A"}
              </p>
              <p>
                <strong>{t("Tickets")}:</strong>{" "}
                {bookingView?.tickets.length || 0} {t("TicketCount")}
              </p>
              {bookingView?.promotion && (
                <p>
                  <strong>{t("Promotion")}:</strong>{" "}
                  {bookingView.promotion.promotionName} (
                  {bookingView.promotion.discount}% off)
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Close")}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

// Custom hook to fetch all bookings
const useGetAllBookingsQuery = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["bookings", page, pageSize],
    queryFn: async () => {
      const response = await http.get<{
        statusCode: number;
        error: string | null;
        message: string;
        data: {
          meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
          };
          result: ResBookingHistoryDTOType[];
        };
      }>("/api/v1/bookings", {
        params: { page, pageSize },
      });
      return response.payload.data;
    },
    enabled: true,
  });
};

export default function BookingTable() {
  const t = useTranslations("Booking");
  const paginationT = useTranslations("Pagination");
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [ticketView, setTicketView] = useState<ResTicketHistoryDTOType | null>(
    null
  );
  const [bookingView, setBookingView] = useState<BookingItem | null>(null);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Fetch user permissions
  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
  } = useAccountProfile();
  const userPermissions = accountData?.data?.user?.role?.permissions as
    | Array<{
        id: number;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }>
    | undefined;

  // Check permission for viewing bookings
  const hasViewPermission = userPermissions?.some(
    (p) => p.module === "BOOKINGS" && p.method === "GET"
  );

  // Fetch booking list
  const bookingListQuery = useGetAllBookingsQuery(page, pageSize);
  const data = bookingListQuery.data?.result ?? [];
  const totalItems = bookingListQuery.data?.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<BookingItem>[] = [
    {
      accessorKey: "bookingCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("BookingCode")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as string;
        return value.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("BookingDate")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return format(new Date(date), "dd/MM/yyyy HH:mm");
      },
    },
    {
      accessorKey: "totalPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("TotalPrice")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = row.getValue("totalPrice") as number;
        return `${price.toLocaleString()} VND`;
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as number;
        return value >= Number(filterValue);
      },
    },
    {
      accessorKey: "paymentStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("PaymentStatus")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string;
        return (
          <span
            className={`${
              status === "success"
                ? "text-green-600"
                : status === "failed"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {status.toUpperCase()}
          </span>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        const value = row.getValue(columnId) as string;
        return value === filterValue;
      },
    },
    {
      accessorKey: "contactEmail",
      header: t("ContactEmail"),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as string;
        return (
          value?.toLowerCase().includes(filterValue.toLowerCase()) ?? false
        );
      },
    },
    {
      id: "actions",
      header: t("Action"),
      enableHiding: false,
      cell: function Actions({ row }) {
        const booking = row.original;
        const { setTicketView, setBookingView } =
          useContext(BookingTableContext);
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
              <DropdownMenuItem onClick={() => setBookingView(booking)}>
                {t("ViewDetails")}
              </DropdownMenuItem>
              {booking.tickets.length > 0 && (
                <DropdownMenuItem
                  onClick={() => setTicketView(booking.tickets[0])}
                >
                  {t("ViewFirstTicket")}
                </DropdownMenuItem>
              )}
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
    <BookingTableContext.Provider
      value={{
        ticketView,
        setTicketView,
        bookingView,
        setBookingView,
      }}
    >
      <div className="w-full">
        <ViewTicketDialog
          ticketView={ticketView}
          setTicketView={setTicketView}
        />
        <ViewBookingDialog
          bookingView={bookingView}
          setBookingView={setBookingView}
        />
        {isAccountLoading || bookingListQuery.isLoading ? (
          <TableSkeleton />
        ) : isAccountError ? (
          <div className="text-red-500">{t("Error_LoadingPermissions")}</div>
        ) : !hasViewPermission ? (
          <div className="text-red-500">{t("NoViewPermission")}</div>
        ) : bookingListQuery.error ? (
          <div className="text-red-500">
            {t("Error")}: {bookingListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder={t("FilterBookingCode")}
                value={
                  (table
                    .getColumn("bookingCode")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("bookingCode")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                placeholder={t("FilterEmail")}
                value={
                  (table
                    .getColumn("contactEmail")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("contactEmail")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                type="number"
                placeholder={t("FilterPrice")}
                value={
                  (table.getColumn("totalPrice")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("totalPrice")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Select
                value={
                  (table
                    .getColumn("paymentStatus")
                    ?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("paymentStatus")
                    ?.setFilterValue(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger className="max-w-sm w-[150px]">
                  <SelectValue placeholder={t("SelectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All")}</SelectItem>
                  <SelectItem value="success">{t("Success")}</SelectItem>
                  <SelectItem value="failed">{t("Failed")}</SelectItem>
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
    </BookingTableContext.Provider>
  );
}
