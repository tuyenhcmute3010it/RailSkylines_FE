"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AutoPagination from "@/components/auto-pagination";
import { useEffect, useState } from "react";
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
import { cn, getVietnameseTableStatus, simpleMatchText } from "@/lib/utils";
import { Input } from "@/components/ui/input";
// import { TrainListResType } from "@/schemaValidations/table.schema";
import { TableStatus } from "@/constants/type";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { TrainListResType } from "@/schemaValidations/train.schema";
import { useTranslations } from "next-intl";

type TrainItem = TrainListResType["data"][0];

export const columns: ColumnDef<TrainItem>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Train Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "route",
    header: "Route",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("route")}</div>
    ),
  },
];

const PAGE_SIZE = 10;

export function TrainDialog({
  onChoose,
}: {
  onChoose: (table: TrainItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const data: TrainListResType["data"] = [
    {
      status: TableStatus.Available,
      name: "SE1",
      route: "Hà Nội - TP.HCM",
      createdAt: new Date("2024-01-01T08:00:00Z"),
      updatedAt: new Date("2024-03-15T10:30:00Z"),
      id: 1,
    },
    {
      status: TableStatus.Reserved,
      name: "SE2",
      route: "Huế - Đà Nẵng",
      createdAt: new Date("2024-02-05T12:15:00Z"),
      updatedAt: new Date("2024-03-10T09:45:00Z"),
      id: 2,
    },
    {
      status: TableStatus.Hidden,
      name: "SE3",
      route: "Hà Nội - Đà Nẵng",
      createdAt: new Date("2023-12-20T07:00:00Z"),
      updatedAt: new Date("2024-02-25T14:20:00Z"),
      id: 3,
    },
    {
      status: TableStatus.Available,
      name: "TN1",
      route: "Sài Gòn - Nha Trang",
      createdAt: new Date("2024-01-10T11:45:00Z"),
      updatedAt: new Date("2024-03-05T16:00:00Z"),
      id: 4,
    },
    {
      status: TableStatus.Reserved,
      name: "TN2",
      route: "Cần Thơ - TP.HCM",
      createdAt: new Date("2024-01-20T13:30:00Z"),
      updatedAt: new Date("2024-03-12T08:10:00Z"),
      id: 5,
    },
  ];
  const paginationT = useTranslations("Pagination");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
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
      pageIndex: 0,
      pageSize: PAGE_SIZE,
    });
  }, [table]);

  const choose = (table: TrainItem) => {
    onChoose(table);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
        <DialogHeader>
          <DialogTitle>Choose Train</DialogTitle>
        </DialogHeader>
        <div>
          <div className="w-full">
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder="Train Name"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="w-[120px]"
              />
              <Input
                placeholder="Route"
                value={
                  (table.getColumn("route")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("route")?.setFilterValue(event.target.value)
                }
                className="w-[120px]"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => {
                          if (
                            row.original.status === TableStatus.Available ||
                            row.original.status === TableStatus.Reserved
                          ) {
                            choose(row.original);
                          }
                        }}
                        className={cn({
                          "cursor-pointer":
                            row.original.status === TableStatus.Available ||
                            row.original.status === TableStatus.Reserved,
                          "cursor-not-allowed":
                            row.original.status === TableStatus.Hidden,
                        })}
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-xs text-muted-foreground py-4 flex-1 ">
                {paginationT("Pagi1")}{" "}
                <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
                {paginationT("Pagi2")} <strong>{data.length}</strong>{" "}
                {paginationT("Pagi3")}
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname="/manage/Tables"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
