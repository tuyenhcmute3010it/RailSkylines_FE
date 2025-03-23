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
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { useTranslations } from "next-intl";
import EditArticle from "./edit-article";
import AddArticle from "./add-article";
import {
  ArticleListResType,
  ArticleType,
} from "@/schemaValidations/article.schema";

// `${manageAccountT("Avatar")}
type ArticleItem = ArticleListResType["data"][0];

const AccountTableContext = createContext<{
  setArticleIdEdit: (value: number) => void;
  articleIdEdit: number | undefined;
  articleDelete: ArticleItem | null;
  setArticleDelete: (value: ArticleItem | null) => void;
}>({
  setArticleIdEdit: (value: number | undefined) => {},
  articleIdEdit: undefined,
  articleDelete: null,
  setArticleDelete: (value: ArticleItem | null) => {},
});

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function ArticleTable() {
  const manageAccountT = useTranslations("ManageAccount");
  const paginationT = useTranslations("Pagination");

  function AlertDialogDeleteAccount({
    articleDelete,
    setArticleDelete,
  }: {
    articleDelete: ArticleItem | null;
    setArticleDelete: (value: ArticleItem | null) => void;
  }) {
    return (
      <AlertDialog
        open={Boolean(articleDelete)}
        onOpenChange={(value) => {
          if (!value) {
            setArticleDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{manageAccountT("Del")}</AlertDialogTitle>
            <AlertDialogDescription>
              {manageAccountT("Deldes")}{" "}
              <span className="bg-foreground text-primary-foreground rounded px-1">
                {articleDelete?.title}
              </span>{" "}
              {manageAccountT("DelDes2")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel> {manageAccountT("Cancel")}</AlertDialogCancel>
            <AlertDialogAction> {manageAccountT("Continue")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const columns: ColumnDef<ArticleType>[] = [
    {
      accessorKey: "id",
      header: `${manageAccountT("ID")}`,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "content",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Content
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("content")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setArticleIdEdit, setArticleDelete } =
          useContext(AccountTableContext);
        const openEditEmployee = () => {
          setArticleIdEdit(row.original.id);
        };

        const openDeleteEmployee = () => {
          setArticleDelete(row.original);
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
              <DropdownMenuLabel>{manageAccountT("Action")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openEditEmployee}>
                {manageAccountT("Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openDeleteEmployee}>
                {manageAccountT("Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [articleIdEdit, setArticleIdEdit] = useState<number | undefined>();
  const [articleDelete, setArticleDelete] = useState<ArticleItem | null>(null);
  const data = [
    {
      id: 1,
      title: "The Future of AI in Healthcare",
      content:
        "Artificial Intelligence is transforming healthcare by improving diagnostics and treatment.",
    },
    {
      id: 2,
      title: "10 Tips for a Healthier Lifestyle",
      content:
        "Maintain a balanced diet, exercise regularly, and prioritize mental well-being.",
    },
    {
      id: 3,
      title: "Understanding the Stock Market",
      content:
        "The stock market allows investors to buy and sell shares of publicly traded companies.",
    },
    {
      id: 4,
      title: "Exploring the Deep Ocean",
      content:
        "The deep ocean remains one of the least explored regions on Earth.",
    },
    {
      id: 5,
      title: "A Beginner's Guide to Web Development",
      content:
        "Learn HTML, CSS, and JavaScript to start your web development journey.",
    },
    {
      id: 6,
      title: "The Rise of Electric Vehicles",
      content:
        "Electric vehicles are becoming more popular due to their environmental benefits.",
    },
    {
      id: 7,
      title: "How to Invest in Real Estate",
      content:
        "Investing in real estate can be profitable with proper research and planning.",
    },
    {
      id: 8,
      title: "The Importance of Mental Health",
      content:
        "Mental health is crucial for overall well-being and should not be neglected.",
    },
    {
      id: 9,
      title: "Top 5 Programming Languages in 2024",
      content:
        "Python, JavaScript, and Rust continue to dominate the programming world.",
    },
    {
      id: 10,
      title: "The Evolution of Space Travel",
      content:
        "Space exploration has advanced significantly with reusable rockets and Mars missions.",
    },
    {
      id: 9,
      title: "Top 5 Programming Languages in 2024",
      content:
        "Python, JavaScript, and Rust continue to dominate the programming world.",
    },
    {
      id: 10,
      title: "The Evolution of Space Travel",
      content:
        "Space exploration has advanced significantly with reusable rockets and Mars missions.",
    },
    {
      id: 9,
      title: "Top 5 Programming Languages in 2024",
      content:
        "Python, JavaScript, and Rust continue to dominate the programming world.",
    },
    {
      id: 10,
      title: "The Evolution of Space Travel",
      content:
        "Space exploration has advanced significantly with reusable rockets and Mars missions.",
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
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
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <AccountTableContext.Provider
      value={{
        articleIdEdit,
        setArticleIdEdit,
        articleDelete,
        setArticleDelete,
      }}
    >
      <div className="w-full">
        <EditArticle
          id={articleIdEdit}
          setId={setArticleIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteAccount
          articleDelete={articleDelete}
          setArticleDelete={setArticleDelete}
        />
        <div className="flex items-center py-4 ">
          <div className="flex gap-5 ">
            <Input
              placeholder="Filter Title"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="w-72"
            />
            <Input
              placeholder="Filter Content"
              value={
                (table.getColumn("content")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("content")?.setFilterValue(event.target.value)
              }
              className="w-72"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AddArticle />
          </div>
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
              pathname="/manage/articles"
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  );
}
