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
import {
  AccountListResType,
  AccountType,
} from "@/schemaValidations/account.schema";
import AddEmployee from "@/app/manage/accounts/add-employee";
import EditEmployee from "@/app/manage/accounts/edit-employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createContext, useContext, useEffect, useState } from "react";
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
import { useSearchParams, useRouter } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { useTranslations } from "next-intl";
import {
  useDeleteAccountMutation,
  useGetAccountList,
} from "@/queries/useAccount";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Text } from "lucide-react";
import Image from "next/image";

type AccountItem = AccountListResType["data"]["result"][0];

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number) => void;
  employeeIdEdit: number | undefined;
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}>({
  setEmployeeIdEdit: () => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: () => {},
});

function AlertDialogDeleteAccount({
  employeeDelete,
  setEmployeeDelete,
}: {
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}) {
  const t = useTranslations("ManageAccount");
  const { mutateAsync } = useDeleteAccountMutation();

  const deleteAccount = async () => {
    if (employeeDelete) {
      try {
        await mutateAsync(employeeDelete.userId);
        setEmployeeDelete(null);
        toast({
          description: t("AccountDeleted", { userId: employeeDelete.userId }),
        });
      } catch (error) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Del")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Deldes")}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {employeeDelete?.fullName}
            </span>{" "}
            {t("DelDes2")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAccount}>
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function AccountTable() {
  const t = useTranslations("ManageAccount");
  const paginationT = useTranslations("Pagination");
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;

  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(
    null
  );
  const accountListQuery = useGetAccountList(page, PAGE_SIZE);
  const data = accountListQuery.data?.payload.data?.result ?? [];
  console.log("dara ne", data);
  const totalItems = accountListQuery.data?.payload.data.meta.total ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const columns: ColumnDef<AccountType>[] = [
    {
      accessorKey: "userId",
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
      accessorKey: "avatar",
      header: t("Avatar"),
      cell: ({ row }) => {
        const avatarUrl = row.getValue("avatar") as string | null;
        // Construct the full image URL
        const imageSrc = `D:/OSSE/ProjectTest/2/${avatarUrl}`;
        return (
          <div>
            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
              <AvatarImage
                src={imageSrc}
                alt={`${row.original.fullName}'s avatar`}
              />
              <span className="text-sm">{imageSrc}</span>
              <AvatarFallback className="rounded-none">
                {row.original.fullName}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Name")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Email")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("PhoneNumber")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("phoneNumber") || "-"}</div>,
    },
    {
      accessorKey: "citizenId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("CitizenId")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("citizenId") || "-"}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("Role")}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("role") || "-"}</div>,
    },
    {
      id: "actions",
      header: t("Action"),
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setEmployeeIdEdit, setEmployeeDelete } =
          useContext(AccountTableContext);
        const openEditEmployee = () => {
          setEmployeeIdEdit(row.original.userId);
        };
        const openDeleteEmployee = () => {
          setEmployeeDelete(row.original);
        };
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("Action")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openEditEmployee}>
                {t("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openDeleteEmployee}>
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
      pagination: { pageIndex, pageSize: PAGE_SIZE },
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
      router.push(`/manage/accounts?${params.toString()}`);
    }
  };

  return (
    <AccountTableContext.Provider
      value={{
        employeeIdEdit,
        setEmployeeIdEdit,
        employeeDelete,
        setEmployeeDelete,
      }}
    >
      <div className="w-full">
        <EditEmployee
          id={employeeIdEdit}
          setId={setEmployeeIdEdit}
          onSubmitSuccess={() => {
            setEmployeeIdEdit(undefined);
            accountListQuery.refetch();
          }}
        />
        <AlertDialogDeleteAccount
          employeeDelete={employeeDelete}
          setEmployeeDelete={setEmployeeDelete}
        />
        {accountListQuery.isLoading ? (
          <div>{t("Loading")}</div>
        ) : accountListQuery.error ? (
          <div className="text-red-500">{t("Error_Generic")}</div>
        ) : (
          <>
            <div className="flex items-center py-4 gap-5">
              <Input
                placeholder={t("FilterEmails")}
                value={
                  (table.getColumn("email")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="w-72"
              />
              <Input
                placeholder={t("FilterNames")}
                value={
                  (table.getColumn("fullName")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("fullName")
                    ?.setFilterValue(event.target.value)
                }
                className="w-72"
              />
              <div className="ml-auto flex items-center gap-2">
                <AddEmployee />
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
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
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
                <strong>{table.getRowModel().rows.length}</strong>{" "}
                {paginationT("Pagi2")} <strong>{totalItems}</strong>{" "}
                {paginationT("Pagi3")}
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname="/manage/accounts"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </AccountTableContext.Provider>
  );
}
