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
import { RoleSchemaType } from "@/schemaValidations/role.schema";
import { useGetRoleList, useDeleteRoleMutation } from "@/queries/useRole";
import TableSkeleton from "@/components/Skeleton";
import RoleModal from "./role-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, createContext, useContext } from "react";
import { PlusCircle } from "lucide-react";
import { useAccountProfile } from "@/queries/useAccount"; // Import useAccountProfile
import { useToast } from "@/components/ui/use-toast";

type RoleItem = RoleSchemaType;

const RoleTableContext = createContext<{
  setRoleIdEdit: (value: number | undefined) => void;
  roleIdEdit: number | undefined;
  roleDelete: RoleItem | null;
  setRoleDelete: (value: RoleItem | null) => void;
}>({
  setRoleIdEdit: () => {},
  roleIdEdit: undefined,
  roleDelete: null,
  setRoleDelete: () => {},
});

function DeleteRoleDialog({
  roleDelete,
  setRoleDelete,
}: {
  roleDelete: RoleItem | null;
  setRoleDelete: (value: RoleItem | null) => void;
}) {
  const t = useTranslations("ManageRole");
  const { toast } = useToast();
  const deleteRoleMutation = useDeleteRoleMutation();

  const handleDelete = async () => {
    if (roleDelete) {
      try {
        await deleteRoleMutation.mutateAsync(roleDelete.id);
        toast({
          title: t("DeleteSuccess"),
          description: t("RoleDeleted", { roleId: roleDelete.id }),
        });
        setRoleDelete(null);
      } catch (error: any) {
        const errorMessage = error?.message || t("Error_Generic");
        toast({
          title: t("DeleteFailed"),
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(roleDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setRoleDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DeleteRole")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("DeleteRoleDes")}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {roleDelete?.name}
            </span>{" "}
            {t("DeleteRoleDes2")}
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

function RoleTable() {
  const t = useTranslations("ManageRole");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [roleIdEdit, setRoleIdEdit] = useState<number | undefined>();
  const [roleDelete, setRoleDelete] = useState<RoleItem | null>(null);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [addModalOpen, setAddModalOpen] = useState(false);

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

  // Check permissions for ROLES module
  const hasAddPermission = userPermissions?.some(
    (p) => p.module === "ROLES" && p.method === "POST"
  );
  const hasEditPermission = userPermissions?.some(
    (p) => p.module === "ROLES" && p.method === "PUT"
  );
  const hasDeletePermission = userPermissions?.some(
    (p) => p.module === "ROLES" && p.method === "DELETE"
  );

  // Fetch role list
  const roleListQuery = useGetRoleList(page, pageSize);
  const data = roleListQuery.data?.payload.data.result ?? [];
  const totalItems = roleListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const columns: ColumnDef<RoleItem>[] = [
    {
      accessorKey: "id",
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
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Name")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue(columnId) as string;
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "description",
      header: t("Description"),
    },
    {
      accessorKey: "active",
      header: t("Active"),
      cell: ({ row }) => (row.getValue("active") ? "ACTIVE" : "INACTIVE"),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        const value = row.getValue(columnId) as boolean;
        return filterValue === "true" ? value : !value;
      },
    },
    {
      id: "actions",
      header: t("Action"),
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setRoleIdEdit, setRoleDelete } = useContext(RoleTableContext);
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
              {hasEditPermission && (
                <DropdownMenuItem
                  onClick={() => setRoleIdEdit(row.original.id)}
                >
                  {t("Edit")}
                </DropdownMenuItem>
              )}
              {hasDeletePermission && (
                <DropdownMenuItem onClick={() => setRoleDelete(row.original)}>
                  {t("Delete")}
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
    <RoleTableContext.Provider
      value={{
        roleIdEdit,
        setRoleIdEdit,
        roleDelete,
        setRoleDelete,
      }}
    >
      <div className="w-full">
        {roleIdEdit !== undefined && hasEditPermission && (
          <RoleModal
            open={true}
            setOpen={() => setRoleIdEdit(undefined)}
            roleId={roleIdEdit}
            onSubmitSuccess={() => {
              setRoleIdEdit(undefined);
              roleListQuery.refetch();
            }}
          />
        )}
        <DeleteRoleDialog
          roleDelete={roleDelete}
          setRoleDelete={setRoleDelete}
        />
        {isAccountLoading ? (
          <TableSkeleton />
        ) : isAccountError ? (
          <div className="text-red-500">Error loading user permissions</div>
        ) : roleListQuery.isLoading ? (
          <TableSkeleton />
        ) : roleListQuery.error ? (
          <div className="text-red-500">
            {t("Error")}: {roleListQuery.error.message}
          </div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder={t("FilterName")}
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm w-[150px]"
              />
              <Select
                value={
                  (table.getColumn("active")?.getFilterValue() as string) ??
                  "all"
                }
                onValueChange={(value) =>
                  table
                    .getColumn("active")
                    ?.setFilterValue(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger className="max-w-sm w-[150px]">
                  <SelectValue placeholder={t("SelectActive")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All")}</SelectItem>
                  <SelectItem value="true">{t("Active")}</SelectItem>
                  <SelectItem value="false">{t("Inactive")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-auto flex items-center gap-2">
                {hasAddPermission && (
                  <>
                    <Button
                      size="sm"
                      className="h-7 gap-1"
                      onClick={() => setAddModalOpen(true)}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>{t("AddRole")}</span>
                    </Button>
                    <RoleModal
                      open={addModalOpen}
                      setOpen={setAddModalOpen}
                      onSubmitSuccess={() => {
                        setAddModalOpen(false);
                        roleListQuery.refetch();
                      }}
                    />
                  </>
                )}
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
    </RoleTableContext.Provider>
  );
}

export default RoleTable;
