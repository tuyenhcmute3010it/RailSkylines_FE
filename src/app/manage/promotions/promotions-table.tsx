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
import EditPromotion from "./edit-promotion";
import AddPromotion from "./add-promotion";

// Định nghĩa type cho Promotion
type Promotion = {
  id: number;
  promotionName: string;
  discount: number;
};

const CarriageTableContext = createContext<{
  setPromotionIdEdit: (value: number) => void;
  promotionIdEdit: number | undefined;
  promotionDelete: Promotion | null;
  setPromotionDelete: (value: Promotion | null) => void;
}>({
  setPromotionIdEdit: (value: number | undefined) => {},
  promotionIdEdit: undefined,
  promotionDelete: null,
  setPromotionDelete: (value: Promotion | null) => {},
});

// Component xác nhận xóa
function DeletePromotionDialog({
  promotionDelete,
  setPromotionDelete,
}: {
  promotionDelete: Promotion | null;
  setPromotionDelete: (value: Promotion | null) => void;
}) {
  return (
    <AlertDialog
      open={Boolean(promotionDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setPromotionDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete promotion{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {promotionDelete?.promotionName}
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

export default function PromotionTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;

  const [promotionIdEdit, setPromotionIdEdit] = useState<number | undefined>();
  const [promotionDelete, setPromotionDelete] = useState<Promotion | null>(
    null
  );

  // Dữ liệu mẫu
  const data: Promotion[] = [
    {
      id: 1,
      promotionName: "Khuyến mãi mùa xuân",
      discount: 20,
    },
    {
      id: 2,
      promotionName: "Giảm giá vé sớm",
      discount: 15,
    },
    {
      id: 3,
      promotionName: "Ưu đãi Ga Quảng Ngãi",
      discount: 10,
    },
    {
      id: 4,
      promotionName: "Vé khứ hồi giảm giá",
      discount: 25,
    },
    {
      id: 5,
      promotionName: "Khuyến mãi sinh viên",
      discount: 30,
    },
    {
      id: 6,
      promotionName: "Giảm giá ngày lễ",
      discount: 20,
    },
    {
      id: 7,
      promotionName: "Ưu đãi Ga Dĩ An",
      discount: 15,
    },
    {
      id: 8,
      promotionName: "Khuyến mãi gia đình",
      discount: 25,
    },
    {
      id: 9,
      promotionName: "Vé cuối tuần",
      discount: 10,
    },
    {
      id: 10,
      promotionName: "Giảm giá đoàn đông",
      discount: 35,
    },
    {
      id: 11,
      promotionName: "Ưu đãi Ga Hà Nội",
      discount: 20,
    },
    {
      id: 12,
      promotionName: "Khuyến mãi mùa hè",
      discount: 30,
    },
  ];
  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "promotionName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Promotion Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setPromotionIdEdit, setPromotionDelete } =
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
                onClick={() => setPromotionIdEdit(row.original.id)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPromotionDelete(row.original)}
              >
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
        promotionIdEdit,
        setPromotionIdEdit,
        promotionDelete,
        setPromotionDelete,
      }}
    >
      <div className="w-full">
        {/* Render EditCarriage chỉ khi promotionIdEdit có giá trị */}
        {promotionIdEdit !== undefined && (
          <EditPromotion
            id={promotionIdEdit}
            setId={setPromotionIdEdit}
            onSubmitSuccess={() => setPromotionIdEdit(undefined)}
          />
        )}
        <DeletePromotionDialog
          promotionDelete={promotionDelete}
          setPromotionDelete={setPromotionDelete}
        />
        <div className="flex items-center py-4 gap-5">
          <Input
            placeholder="Filter Promotion Name..."
            value={
              (table.getColumn("promotionName")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("promotionName")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-100"
          />
          <Input
            placeholder="Filter Discount..."
            value={
              (table.getColumn("discount")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("discount")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-100"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddPromotion />
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
            of <strong>{data.length}</strong> promotions
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/promotions"
            />
          </div>
        </div>
      </div>
    </CarriageTableContext.Provider>
  );
}
