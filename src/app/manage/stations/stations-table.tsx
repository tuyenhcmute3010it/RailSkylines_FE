// "use client";
// import {
//   CaretSortIcon,
//   DotsHorizontalIcon,
//   PlusCircledIcon,
// } from "@radix-ui/react-icons";
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
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useState, createContext, useContext, useEffect } from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useTranslations } from "next-intl";
// import EditStation from "./edit-station";
// import AddStation from "./add-station";
// import AutoPagination from "@/components/auto-pagination";
// import TableSkeleton from "@/components/Skeleton";
// import {
//   useGetStationList,
//   useDeleteStationMutation,
// } from "@/queries/useStation";
// import { StationSchemaType } from "@/schemaValidations/station.schema";
// import { useToast } from "@/components/ui/use-toast";

// const StationTableContext = createContext<{
//   setStationIdEdit: (value: number | undefined) => void;
//   stationIdEdit: number | undefined;
//   stationDelete: StationSchemaType | null;
//   setStationDelete: (value: StationSchemaType | null) => void;
// }>({
//   setStationIdEdit: () => {},
//   stationIdEdit: undefined,
//   stationDelete: null,
//   setStationDelete: () => {},
// });

// function DeleteStationDialog({
//   stationDelete,
//   setStationDelete,
//   onDelete,
// }: {
//   stationDelete: StationSchemaType | null;
//   setStationDelete: (value: StationSchemaType | null) => void;
//   onDelete: (id: number) => Promise<void>;
// }) {
//   const t = useTranslations("ManageStation");

//   const handleDelete = async () => {
//     if (stationDelete) {
//       await onDelete(stationDelete.stationId);
//       setStationDelete(null);
//     }
//   };

//   return (
//     <AlertDialog
//       open={Boolean(stationDelete)}
//       onOpenChange={(value) => {
//         if (!value) {
//           setStationDelete(null);
//         }
//       }}
//     >
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{t("Del")}</AlertDialogTitle>
//           <AlertDialogDescription>
//             {t("Deldes")}{" "}
//             <span className="bg-foreground text-primary-foreground rounded px-1">
//               {stationDelete?.stationName}
//             </span>{" "}
//             {t("DelDes2")}
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
//           <AlertDialogAction onClick={handleDelete}>
//             {t("Continue")}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// const PAGE_SIZE = 10;

// export default function StationTable() {
//   const t = useTranslations("ManageStation");
//   const paginationT = useTranslations("Pagination");
//   const { toast } = useToast();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
//   const pageIndex = page - 1;

//   const [stationIdEdit, setStationIdEdit] = useState<number | undefined>();
//   const [stationDelete, setStationDelete] = useState<StationSchemaType | null>(
//     null
//   );

//   // Fetch station list
//   const stationListQuery = useGetStationList(page, PAGE_SIZE);
//   const deleteStationMutation = useDeleteStationMutation();
//   const data = stationListQuery.data?.payload?.data.result ?? [];
//   const totalItems = stationListQuery.data?.payload.data.meta.total ?? 0;
//   const totalPages = Math.ceil(totalItems / PAGE_SIZE);

//   const columns: ColumnDef<StationSchemaType>[] = [
//     {
//       accessorKey: "stationId",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {t("ID")}
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "stationName",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {t("StationName")}
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       filterFn: (row, columnId, filterValue) => {
//         if (!filterValue) return true;
//         const value = row.getValue(columnId) as string;
//         return value.toLowerCase().includes(filterValue.toLowerCase());
//       },
//     },
//     {
//       accessorKey: "position",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           {t("Position")}
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       filterFn: (row, columnId, filterValue) => {
//         if (!filterValue) return true;
//         const value = row.getValue(columnId) as number;
//         return value >= Number(filterValue);
//       },
//     },
//     {
//       id: "actions",
//       header: t("Action"),
//       enableHiding: false,
//       cell: function Actions({ row }) {
//         const { setStationIdEdit, setStationDelete } =
//           useContext(StationTableContext);
//         return (
//           <DropdownMenu modal={false}>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <DotsHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>{t("Action")}</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => setStationIdEdit(row.original.stationId)}
//               >
//                 {t("Edit")}
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setStationDelete(row.original)}>
//                 {t("Delete")}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});

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
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination: { pageIndex, pageSize: PAGE_SIZE },
//     },
//     pageCount: totalPages,
//     manualPagination: true,
//   });

//   useEffect(() => {
//     table.setPageIndex(pageIndex);
//   }, [table, pageIndex]);

//   const goToPage = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("page", newPage.toString());
//       router.push(`/manage/stations?${params.toString()}`);
//     }
//   };

//   const handleDeleteStation = async (id: number) => {
//     try {
//       await deleteStationMutation.mutateAsync(id);
//       toast({
//         title: t("DeleteSuccess"),
//         description: t("StationDeleted", { stationId: id }),
//       });
//     } catch (error) {
//       toast({
//         title: t("DeleteFailed"),
//         description: t("Error_Generic"),
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <StationTableContext.Provider
//       value={{
//         stationIdEdit,
//         setStationIdEdit,
//         stationDelete,
//         setStationDelete,
//       }}
//     >
//       <div className="w-full">
//         {stationIdEdit !== undefined && (
//           <EditStation
//             id={stationIdEdit}
//             setId={setStationIdEdit}
//             onSubmitSuccess={() => {
//               setStationIdEdit(undefined);
//               stationListQuery.refetch();
//             }}
//           />
//         )}
//         <DeleteStationDialog
//           stationDelete={stationDelete}
//           setStationDelete={setStationDelete}
//           onDelete={handleDeleteStation}
//         />
//         {stationListQuery.isLoading ? (
//           <TableSkeleton />
//         ) : stationListQuery.error ? (
//           <div className="text-red-500">
//             {t("Error")}: {stationListQuery.error.message}
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center py-4 gap-5">
//               <Input
//                 placeholder={t("FilterStationName")}
//                 value={
//                   (table
//                     .getColumn("stationName")
//                     ?.getFilterValue() as string) ?? ""
//                 }
//                 onChange={(event) =>
//                   table
//                     .getColumn("stationName")
//                     ?.setFilterValue(event.target.value)
//                 }
//                 className="max-w-sm w-[150px]"
//               />
//               <Input
//                 type="number"
//                 placeholder={t("FilterPosition")}
//                 value={
//                   (table.getColumn("position")?.getFilterValue() as string) ??
//                   ""
//                 }
//                 onChange={(event) =>
//                   table
//                     .getColumn("position")
//                     ?.setFilterValue(event.target.value)
//                 }
//                 className="max-w-sm w-[150px]"
//               />
//               <div className="ml-auto flex items-center gap-2">
//                 <AddStation />
//               </div>
//             </div>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((headerGroup) => (
//                     <TableRow key={headerGroup.id}>
//                       {headerGroup.headers.map((header) => (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//                 <TableBody>
//                   {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map((row) => (
//                       <TableRow key={row.id}>
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
//                         {t("NoResults")}
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//             <div className="flex items-center justify-between py-4">
//               <div className="text-xs text-muted-foreground">
//                 {paginationT("Pagi1")}{" "}
//                 <strong>{table.getRowModel().rows.length}</strong>{" "}
//                 {paginationT("Pagi2")} <strong>{totalItems}</strong>{" "}
//                 {paginationT("Pagi3")}
//               </div>
//               <div>
//                 <AutoPagination
//                   page={table.getState().pagination.pageIndex + 1}
//                   pageSize={table.getPageCount()}
//                   pathname="/manage/stations"
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </StationTableContext.Provider>
//   );
// }

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
import { useState, createContext, useContext, useEffect } from "react";
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
import { useTranslations } from "next-intl";
import EditStation from "./edit-station";
import AddStation from "./add-station";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableSkeleton from "@/components/Skeleton";
import {
  useGetStationList,
  useDeleteStationMutation,
} from "@/queries/useStation";
import { StationSchemaType } from "@/schemaValidations/station.schema";
import { useToast } from "@/components/ui/use-toast";

const StationTableContext = createContext<{
  setStationIdEdit: (value: number | undefined) => void;
  stationIdEdit: number | undefined;
  stationDelete: StationSchemaType | null;
  setStationDelete: (value: StationSchemaType | null) => void;
}>({
  setStationIdEdit: () => {},
  stationIdEdit: undefined,
  stationDelete: null,
  setStationDelete: () => {},
});

function DeleteStationDialog({
  stationDelete,
  setStationDelete,
  onDelete,
}: {
  stationDelete: StationSchemaType | null;
  setStationDelete: (value: StationSchemaType | null) => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const t = useTranslations("ManageStation");

  const handleDelete = async () => {
    if (stationDelete) {
      await onDelete(stationDelete.stationId);
      setStationDelete(null);
    }
  };

  return (
    <AlertDialog
      open={Boolean(stationDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setStationDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Del")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Deldes")}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {stationDelete?.stationName}
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

const PAGE_SIZE = 10;

export default function StationTable() {
  const t = useTranslations("ManageStation");
  const paginationT = useTranslations("Pagination");
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [stationIdEdit, setStationIdEdit] = useState<number | undefined>();
  const [stationDelete, setStationDelete] = useState<StationSchemaType | null>(
    null
  );
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const stationListQuery = useGetStationList(page, pageSize);
  const deleteStationMutation = useDeleteStationMutation();
  const data = stationListQuery.data?.payload?.data.result ?? [];
  const totalItems = stationListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<StationSchemaType>[] = [
    {
      accessorKey: "stationId",
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
      accessorKey: "stationName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("StationName")}
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
      accessorKey: "position",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Position")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as number;
        return value >= Number(filterValue);
      },
    },
    {
      id: "actions",
      header: t("Action"),
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setStationIdEdit, setStationDelete } =
          useContext(StationTableContext);
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
                onClick={() => setStationIdEdit(row.original.stationId)}
              >
                {t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStationDelete(row.original)}>
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
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleDeleteStation = async (id: number) => {
    try {
      await deleteStationMutation.mutateAsync(id);
      // toast({
      //   title: t("DeleteSuccess"),
      //   description: t("StationDeleted", { stationId: id }),
      // });
      stationListQuery.refetch();
    } catch (error: any) {
      const errorMessage = error?.message || t("Error_Generic");
      stationListQuery.refetch();
      // toast({
      //   title: t("DeleteFailed"),
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    }
  };

  return (
    <StationTableContext.Provider
      value={{
        stationIdEdit,
        setStationIdEdit,
        stationDelete,
        setStationDelete,
      }}
    >
      <div className="w-full">
        {stationIdEdit !== undefined && (
          <EditStation
            id={stationIdEdit}
            setId={setStationIdEdit}
            onSubmitSuccess={() => {
              setStationIdEdit(undefined);
              stationListQuery.refetch();
            }}
          />
        )}
        <DeleteStationDialog
          stationDelete={stationDelete}
          setStationDelete={setStationDelete}
          onDelete={handleDeleteStation}
        />
        {stationListQuery.isLoading ? (
          <TableSkeleton />
        ) : stationListQuery.error ? (
          <div className="text-red-500">
            {t("Error")}: {stationListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder={t("FilterStationName")}
                value={
                  (table
                    .getColumn("stationName")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("stationName")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Input
                type="number"
                placeholder={t("FilterPosition")}
                value={
                  (table.getColumn("position")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("position")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <div className="ml-auto flex items-center gap-2">
                <AddStation />
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
    </StationTableContext.Provider>
  );
}
