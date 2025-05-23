"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useGetPromotionList,
  useDeletePromotionMutation,
} from "@/queries/usePromotion";
import { PromotionSchemaType } from "@/schemaValidations/promotion.schema";
import { Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import AddPromotionDialog from "./add-promotion";
import EditPromotionDialog from "./edit-promotion";
import { useAccountProfile } from "@/queries/useAccount"; // Import useAccountProfile

const PromotionsPageClient = () => {
  const t = useTranslations("ManagePromotion");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingPromotionId, setEditingPromotionId] = useState<
    number | undefined
  >(undefined);
  const [deletingPromotionId, setDeletingPromotionId] = useState<
    number | undefined
  >(undefined);

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

  // Check permissions for PROMOTIONS module
  const hasAddPermission = userPermissions?.some(
    (p) => p.module === "PROMOTIONS" && p.method === "POST"
  );
  const hasEditPermission = userPermissions?.some(
    (p) => p.module === "PROMOTIONS" && p.method === "PUT"
  );
  const hasDeletePermission = userPermissions?.some(
    (p) => p.module === "PROMOTIONS" && p.method === "DELETE"
  );

  const {
    data: promotionsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetPromotionList(currentPage, pageSize);

  const deletePromotionMutation = useDeletePromotionMutation();

  const handleDeletePromotion = async () => {
    if (!deletingPromotionId) return;

    try {
      await deletePromotionMutation.mutateAsync(deletingPromotionId);
      toast({
        title: t("Success"),
        description: t("PromotionDeletedSuccessfully"),
      });
      setDeletingPromotionId(undefined);
    } catch (error) {
      handleErrorApi({ error, duration: 5000 });
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("FailedToDeletePromotion"),
      });
    }
  };

  const promotions = promotionsResponse?.payload.data?.result || [];
  const meta = promotionsResponse?.payload.meta;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
    );
  };

  if (isAccountLoading || isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAccountError || isError) {
    return (
      <div className="text-red-600 flex flex-col items-center py-10">
        <AlertTriangle className="h-10 w-10 mb-2" />
        <p>{t("FailedToLoadPromotions")}</p>
        <Button onClick={() => refetch()} className="mt-4">
          {t("Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{t("ManagePromotions")}</h1>
        {hasAddPermission && <AddPromotionDialog />}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("PromotionName")}</TableHead>
              <TableHead>{t("Code")}</TableHead>
              <TableHead className="text-right">{t("Discount")}</TableHead>
              <TableHead>{t("StartDate")}</TableHead>
              <TableHead>{t("ValidityDate")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  {t("NoPromotionsFound")}
                </TableCell>
              </TableRow>
            )}
            {promotions.map((promo: PromotionSchemaType) => (
              <TableRow key={promo.promotionId}>
                <TableCell className="font-medium">
                  {promo.promotionName}
                </TableCell>
                <TableCell>{promo.promotionCode}</TableCell>
                <TableCell className="text-right">{promo.discount}%</TableCell>
                <TableCell>{formatDate(promo.startDate)}</TableCell>
                <TableCell>{formatDate(promo.validity)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      promo.status === "active"
                        ? "bg-green-100 text-green-700"
                        : promo.status === "inactive"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t(promo.status)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {hasEditPermission && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 h-8 w-8"
                      onClick={() => setEditingPromotionId(promo.promotionId)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {hasDeletePermission && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 h-8 w-8"
                      onClick={() => setDeletingPromotionId(promo.promotionId)}
                      disabled={
                        deletePromotionMutation.isPending &&
                        deletingPromotionId === promo.promotionId
                      }
                    >
                      {deletePromotionMutation.isPending &&
                      deletingPromotionId === promo.promotionId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && meta.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
              {[...Array(meta.pages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  meta.pages <= 5 ||
                  pageNum === currentPage ||
                  pageNum === 1 ||
                  pageNum === meta.pages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ||
                  (currentPage <= 2 && pageNum <= 3) ||
                  (currentPage >= meta.pages - 1 && pageNum >= meta.pages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < meta.pages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage >= meta.pages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {hasEditPermission && (
        <EditPromotionDialog
          promotionId={editingPromotionId}
          setPromotionId={setEditingPromotionId}
          onSuccess={() => refetch()}
        />
      )}

      <AlertDialog
        open={Boolean(deletingPromotionId)}
        onOpenChange={(open) => !open && setDeletingPromotionId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ConfirmDeletionTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("ConfirmDeletionDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeletingPromotionId(undefined)}
            >
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePromotion}
              disabled={deletePromotionMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePromotionMutation.isPending
                ? t("Deleting...")
                : t("Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PromotionsPageClient;
