"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PromotionSchemaType } from "@/schemaValidations/promotion.schema";
import promotionsApiRequest from "@/apiRequests/promotion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PromotionListResType } from "@/schemaValidations/promotion.schema";

const PromotionDisplay = () => {
  const t = useTranslations("HomePage");
  const [promotions, setPromotions] = useState<PromotionSchemaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const response = await promotionsApiRequest.listPromotions(1, 10); // Fetch first page, 10 items
        const promotionsData = (response?.payload?.data?.result || []).filter(
          (promo: PromotionSchemaType) => promo.status === "active"
        );
        setPromotions(promotionsData);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        console.error("Failed to fetch promotions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>{t("FailedToLoadPromotions")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("ActivePromotions")}</h3>
      {promotions.length === 0 ? (
        <p className="text-sm text-gray-500">{t("NoPromotionsAvailable")}</p>
      ) : (
        <ul className="space-y-2">
          {promotions.map((promo) => (
            <li
              key={promo.promotionId}
              className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r-lg"
            >
              <h4 className="text-sm font-medium">{promo.promotionName}</h4>
              <p className="text-xs text-gray-600">
                {t("Code")}: {promo.promotionCode}
              </p>
              <p className="text-xs text-gray-600">
                {t("Discount")}: {promo.discount}%
              </p>
              <p className="text-xs text-gray-600">
                {t("ValidUntil")}: {formatDate(promo.validity)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PromotionDisplay;
