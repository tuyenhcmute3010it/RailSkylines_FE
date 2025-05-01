// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import AutoPagination from "@/components/auto-pagination";
// import { useEffect, useState } from "react";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { cn, getVietnameseTableStatus, simpleMatchText } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// // import { TrainListResType } from "@/schemaValidations/table.schema";
// import { TableStatus } from "@/constants/type";
// import { CaretSortIcon } from "@radix-ui/react-icons";
// import { TrainListResType } from "@/schemaValidations/train.schema";
// import { useTranslations } from "next-intl";

// type TrainItem = TrainListResType["data"][0];

// export const columns: ColumnDef<TrainItem>[] = [
//   {
//     accessorKey: "id",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Id
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     sortingFn: "alphanumeric",
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Train Name
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => <div>{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "route",
//     header: "Route",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("route")}</div>
//     ),
//   },
// ];

// const PAGE_SIZE = 10;

// export function TrainDialog({
//   onChoose,
// }: {
//   onChoose: (table: TrainItem) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const data: TrainListResType["data"] =
//   const paginationT = useTranslations("Pagination");
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [pagination, setPagination] = useState({
//     pageIndex: 0, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
//     pageSize: PAGE_SIZE, //default page size
//   });

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: setPagination,
//     autoResetPageIndex: false,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//   });

//   useEffect(() => {
//     table.setPagination({
//       pageIndex: 0,
//       pageSize: PAGE_SIZE,
//     });
//   }, [table]);

//   const choose = (table: TrainItem) => {
//     onChoose(table);
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Thay đổi</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
//         <DialogHeader>
//           <DialogTitle>Choose Train</DialogTitle>
//         </DialogHeader>
//         <div>
//           <div className="w-full">
//             <div className="flex items-center py-4 gap-5">
//               <Input
//                 placeholder="Train Name"
//                 value={
//                   (table.getColumn("name")?.getFilterValue() as string) ?? ""
//                 }
//                 onChange={(event) =>
//                   table.getColumn("name")?.setFilterValue(event.target.value)
//                 }
//                 className="w-[120px]"
//               />
//               <Input
//                 placeholder="Route"
//                 value={
//                   (table.getColumn("route")?.getFilterValue() as string) ?? ""
//                 }
//                 onChange={(event) =>
//                   table.getColumn("route")?.setFilterValue(event.target.value)
//                 }
//                 className="w-[120px]"
//               />
//             </div>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((headerGroup) => (
//                     <TableRow key={headerGroup.id}>
//                       {headerGroup.headers.map((header) => {
//                         return (
//                           <TableHead key={header.id}>
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext()
//                                 )}
//                           </TableHead>
//                         );
//                       })}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//                 <TableBody>
//                   {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map((row) => (
//                       <TableRow
//                         key={row.id}
//                         data-state={row.getIsSelected() && "selected"}
//                         onClick={() => {
//                           if (
//                             row.original.status === TableStatus.Available ||
//                             row.original.status === TableStatus.Reserved
//                           ) {
//                             choose(row.original);
//                           }
//                         }}
//                         className={cn({
//                           "cursor-pointer":
//                             row.original.status === TableStatus.Available ||
//                             row.original.status === TableStatus.Reserved,
//                           "cursor-not-allowed":
//                             row.original.status === TableStatus.Hidden,
//                         })}
//                       >
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id}>
//                             {flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext()
//                             )}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={columns.length}
//                         className="h-24 text-center"
//                       >
//                         No results.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex items-center justify-end space-x-2 py-4">
//               <div className="text-xs text-muted-foreground py-4 flex-1 ">
//                 {paginationT("Pagi1")}{" "}
//                 <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
//                 {paginationT("Pagi2")} <strong>{data.length}</strong>{" "}
//                 {paginationT("Pagi3")}
//               </div>
//               <div>
//                 <AutoPagination
//                   page={table.getState().pagination.pageIndex + 1}
//                   pageSize={table.getPageCount()}
//                   pathname="/manage/Tables"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn, simpleMatchText } from "@/lib/utils";
import { TrainListResType } from "@/schemaValidations/train.schema";
import { useGetTrainList } from "@/queries/useTrain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TrainItem = TrainListResType["data"]["result"][0];

export const columns: ColumnDef<TrainItem>[] = [
  {
    accessorKey: "trainId",
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
    accessorKey: "trainName",
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
    cell: ({ row }) => <div>{row.getValue("trainName")}</div>,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.getValue(columnId) as string;
      return simpleMatchText(value, filterValue);
    },
  },
  {
    accessorKey: "trainStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("trainStatus")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId);
      return value === filterValue;
    },
  },
];

const PAGE_SIZE = 10;

export function TrainDialog({
  onChoose,
}: {
  onChoose: (train: TrainItem) => void;
}) {
  const t = useTranslations("TrainDialog");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // Fetch train list
  const trainListQuery = useGetTrainList(page, pageSize);
  const data = trainListQuery.data?.payload.data.result ?? [];
  const totalItems = trainListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

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

  // Sync pagination with URL
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
      router.push(pathname); // Clear page param
    }
  }, [open, table, router, pathname]);

  // Handle page navigation
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const choose = (train: TrainItem) => {
    onChoose(train);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("ChangeTrain")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("ChooseTrain")}</DialogTitle>
        </DialogHeader>
        <div>
          {trainListQuery.isLoading ? (
            <div>Loading...</div>
          ) : trainListQuery.error ? (
            <div className="text-red-500">
              Error: {trainListQuery.error.message}
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center py-4 gap-5">
                <Input
                  placeholder={t("FilterTrainName")}
                  value={
                    (table
                      .getColumn("trainName")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("trainName")
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-[120px]"
                />
                <Select
                  value={
                    (table
                      .getColumn("trainStatus")
                      ?.getFilterValue() as string) ?? "all"
                  }
                  onValueChange={(value) =>
                    table
                      .getColumn("trainStatus")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder={t("FilterStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("All")}</SelectItem>
                    <SelectItem value="active">{t("Active")}</SelectItem>
                    <SelectItem value="inactive">{t("Inactive")}</SelectItem>
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
                          onClick={() => choose(row.original)}
                          className={cn(
                            "cursor-pointer",
                            row.original.trainStatus === "inactive" && [
                              "opacity-50",
                              "pointer-events-none",
                            ]
                          )}
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
                  <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
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
                    {t("Previous")}
                  </Button>
                  <span>
                    {t("Page")} {page} {t("Of")} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    {t("Next")}
                  </Button>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      goToPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder={t("RowsPerPage")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
