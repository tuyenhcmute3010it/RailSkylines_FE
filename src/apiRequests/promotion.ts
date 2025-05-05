import http from "@/lib/http";
import {
  CreatePromotionBodyType,
  PromotionListResType,
  PromotionResType,
  UpdatePromotionBodyType,
} from "@/schemaValidations/promotion.schema";

const prefix = "/api/v1/promotions";

const promotionsApiRequest = {
  listPromotion: (page: number = 1, size: number = 10) =>
    http.get<PromotionListResType>(`${prefix}?page=${page}&size=${size}`),
  addPromotion: (body: CreatePromotionBodyType) =>
    http.post<PromotionResType>(prefix, body),
  updatePromotion: (id: number, body: UpdatePromotionBodyType) =>
    http.put<PromotionResType>(`${prefix}/${id}`, body),
  getPromotion: (id: number) => http.get<PromotionResType>(`${prefix}/${id}`),
  deletePromotion: (id: number) =>
    http.delete<PromotionResType>(`${prefix}/${id}`),
};

export default promotionsApiRequest;
