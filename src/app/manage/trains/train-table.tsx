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
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
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
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import AddTrain from "./add-train";
// import EditTrain from "./edit-train";
// import { useGetTrainList } from "@/queries/useTrain";
// import { TrainListResType } from "@/schemaValidations/train.schema";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// type TrainItem = TrainListResType["data"]["result"][0];
// const TrainTableContext = createContext<{
//   setTrainIdEdit: (value: number) => void;
//   trainIdEdit: number | undefined;
//   trainDelete: TrainItem | null;
//   setTrainDelete: (value: TrainItem | null) => void;
// }>({
//   setTrainIdEdit: (value: number | undefined) => {},
//   trainIdEdit: undefined,
//   trainDelete: null,
//   setTrainDelete: (value: TrainItem | null) => {},
// });

// function DeleteTrainDialog({
//   trainDelete,
//   setTrainDelete,
// }: {
//   trainDelete: TrainItem | null;
//   setTrainDelete: (value: TrainItem | null) => void;
// }) {
//   return (
//     <AlertDialog
//       open={Boolean(trainDelete)}
//       onOpenChange={(value) => {
//         if (!value) {
//           setTrainDelete(null);
//         }
//       }}
//     >
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete Train</AlertDialogTitle>
//           <AlertDialogDescription>
//             Are you sure you want to delete train{" "}
//             <span className="bg-foreground text-primary-foreground rounded px-1">
//               {trainDelete?.trainName}
//             </span>
//             ? This action cannot be undone.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// const PAGE_SIZE = 10;

// export default function TrainTable() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();
//   const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
//   const pageIndex = page - 1;

//   const [trainIdEdit, setTrainIdEdit] = useState<number | undefined>();
//   const [trainDelete, setTrainDelete] = useState<TrainItem | null>(null);
//   const [pageSize, setPageSize] = useState(PAGE_SIZE); // Dynamic page size

//   // Fetch train list with dynamic page and size
//   const trainListQuery = useGetTrainList(page, pageSize);
//   const data = trainListQuery.data?.payload.data.result ?? [];
//   const totalItems = trainListQuery.data?.payload.data.meta.total ?? 0; // Assume API returns total count
//   const totalPages = Math.ceil(totalItems / pageSize);

//   const columns: ColumnDef<TrainItem>[] = [
//     {
//       accessorKey: "trainId",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Train Id
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "trainName",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Train Name
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
//       accessorKey: "trainStatus",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Train Status
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => row.original.trainStatus ?? "N/A",
//       filterFn: (row, columnId, filterValue) => {
//         const value = row.getValue(columnId);
//         if (filterValue === "all" || filterValue === undefined) return true;
//         return value === filterValue;
//       },
//     },
//     {
//       id: "actions",
//       header: "Action",
//       enableHiding: false,
//       cell: function Actions({ row }) {
//         const { setTrainIdEdit, setTrainDelete } =
//           useContext(TrainTableContext);
//         return (
//           <DropdownMenu modal={false}>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <DotsHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => setTrainIdEdit(row.original.id)}>
//                 Edit
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setTrainDelete(row.original)}>
//                 Delete
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
//       pagination: { pageIndex, pageSize },
//     },
//     pageCount: totalPages,
//     manualPagination: true,
//   });

//   // Sync table pagination with URL
//   useEffect(() => {
//     table.setPageIndex(pageIndex);
//   }, [table, pageIndex]);

//   // Handle page navigation
//   const goToPage = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("page", newPage.toString());
//       router.push(`${pathname}?${params.toString()}`);
//     }
//   };

//   return (
//     <TrainTableContext.Provider
//       value={{ trainIdEdit, setTrainIdEdit, trainDelete, setTrainDelete }}
//     >
//       <div className="w-full">
//         {trainIdEdit !== undefined && (
//           <EditTrain
//             id={trainIdEdit}
//             setId={setTrainIdEdit}
//             onSubmitSuccess={() => setTrainIdEdit(undefined)}
//           />
//         )}
//         <DeleteTrainDialog
//           trainDelete={trainDelete}
//           setTrainDelete={setTrainDelete}
//         />
//         <div className="flex items-center py-4 gap-5">
//           <Select
//             value={
//               (table.getColumn("trainStatus")?.getFilterValue() as string) ??
//               "all"
//             }
//             onValueChange={(value) => {
//               table
//                 .getColumn("trainStatus")
//                 ?.setFilterValue(value === "all" ? undefined : value);
//             }}
//           >
//             <SelectTrigger className="max-w-sm w-100">
//               <SelectValue placeholder="Filter train status..." />
//             </SelectTrigger>
//             <SelectContent className="max-w-sm w-100">
//               <SelectItem value="all">All</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//           <Input
//             placeholder="Filter Train Name..."
//             value={
//               (table.getColumn("trainName")?.getFilterValue() as string) ?? ""
//             }
//             onChange={(event) =>
//               table.getColumn("trainName")?.setFilterValue(event.target.value)
//             }
//             className="max-w-sm w-100"
//           />
//           <div className="ml-auto flex items-center gap-2">
//             <AddTrain />
//           </div>
//         </div>
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id}>
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <div className="flex items-center justify-between py-4">
//           <div className="text-xs text-muted-foreground">
//             Showing <strong>{table.getRowModel().rows.length}</strong> of{" "}
//             <strong>{totalItems}</strong> trains
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => goToPage(page - 1)}
//               disabled={page === 1}
//             >
//               Previous
//             </Button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => goToPage(page + 1)}
//               disabled={page === totalPages}
//             >
//               Next
//             </Button>
//             <Select
//               value={pageSize.toString()}
//               onValueChange={(value) => {
//                 setPageSize(Number(value));
//                 goToPage(1);
//               }}
//             >
//               <SelectTrigger className="w-[100px]">
//                 <SelectValue placeholder="Rows per page" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="10">10</SelectItem>
//                 <SelectItem value="20">20</SelectItem>
//                 <SelectItem value="50">50</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </div>
//     </TrainTableContext.Provider>
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
import AddTrain from "./add-train";
import EditTrain from "./edit-train";
import { useGetTrainList } from "@/queries/useTrain";
import { TrainListResType } from "@/schemaValidations/train.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TrainItem = TrainListResType["data"]["result"][0];
const TrainTableContext = createContext<{
  setTrainIdEdit: (value: number | undefined) => void;
  trainIdEdit: number | undefined;
  trainDelete: TrainItem | null;
  setTrainDelete: (value: TrainItem | null) => void;
}>({
  setTrainIdEdit: () => {},
  trainIdEdit: undefined,
  trainDelete: null,
  setTrainDelete: () => {},
});

function DeleteTrainDialog({
  trainDelete,
  setTrainDelete,
}: {
  trainDelete: TrainItem | null;
  setTrainDelete: (value: TrainItem | null) => void;
}) {
  return (
    <AlertDialog
      open={Boolean(trainDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTrainDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Train</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete train{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {trainDelete?.trainName}
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

export default function TrainTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [trainIdEdit, setTrainIdEdit] = useState<number | undefined>();
  const [trainDelete, setTrainDelete] = useState<TrainItem | null>(null);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const trainListQuery = useGetTrainList(page, pageSize);
  const data = trainListQuery.data?.payload.data.result ?? [];
  const totalItems = trainListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<TrainItem>[] = [
    {
      accessorKey: "trainId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Train Id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "trainName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Train Name
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
      accessorKey: "trainStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Train Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.trainStatus ?? "N/A",
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        if (filterValue === "all" || filterValue === undefined) return true;
        return value === filterValue;
      },
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setTrainIdEdit, setTrainDelete } =
          useContext(TrainTableContext);
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
                onClick={() => setTrainIdEdit(row.original.trainId)} // Fixed: use trainId
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTrainDelete(row.original)}>
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
    <TrainTableContext.Provider
      value={{ trainIdEdit, setTrainIdEdit, trainDelete, setTrainDelete }}
    >
      <div className="w-full">
        {trainIdEdit !== undefined && (
          <EditTrain
            id={trainIdEdit}
            setId={setTrainIdEdit}
            onSubmitSuccess={() => {
              setTrainIdEdit(undefined);
              trainListQuery.refetch(); // Refresh table
            }}
          />
        )}
        <DeleteTrainDialog
          trainDelete={trainDelete}
          setTrainDelete={setTrainDelete}
        />
        <div className="flex items-center py-4 gap-5">
          <Select
            value={
              (table.getColumn("trainStatus")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) => {
              table
                .getColumn("trainStatus")
                ?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="max-w-sm w-100">
              <SelectValue placeholder="Filter train status..." />
            </SelectTrigger>
            <SelectContent className="max-w-sm w-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter Train Name..."
            value={
              (table.getColumn("trainName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("trainName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-100"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddTrain />
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
        <div className="flex items-center justify-between py-4">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{table.getRowModel().rows.length}</strong> of{" "}
            <strong>{totalItems}</strong> trains
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                goToPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Rows per page" />
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
    </TrainTableContext.Provider>
  );
}
