// import http from "@/lib/http";
// import {
//   CreatePromotionBodyType,
//   PromotionListResType,
//   PromotionResType,
//   UpdatePromotionBodyType,
// } from "@/schemaValidations/promotion.schema";

// const prefix = "/api/v1/promotions";

// const promotionsApiRequest = {
//   listPromotion: (page: number = 1, size: number = 10) =>
//     http.get<PromotionListResType>(`${prefix}?page=${page}&size=${size}`),
//   addPromotion: (body: CreatePromotionBodyType) =>
//     http.post<PromotionResType>(prefix, body),
//   updatePromotion: (id: number, body: UpdatePromotionBodyType) =>
//     http.put<PromotionResType>(`${prefix}/${id}`, body),
//   getPromotion: (id: number) => http.get<PromotionResType>(`${prefix}/${id}`),
//   deletePromotion: (id: number) =>
//     http.delete<PromotionResType>(`${prefix}/${id}`),
// };

// export default promotionsApiRequest;

// src/apiRequests/promotion.ts
import http from "@/lib/http"; // Assuming you have a similar http client setup
import {
  CreatePromotionBodyType,
  PromotionListResType,
  PromotionSchemaType, // Using PromotionSchemaType for single promotion direct response
  UpdatePromotionBodyType,
  UpdatePromotionStatusBodyType,
} from "@/schemaValidations/promotion.schema";

const prefix = "/api/v1/promotions";

const promotionsApiRequest = {
  // GET /api/v1/promotions (Fetch All Promotions with pagination and filter)
  // The BE uses @Filter Specification<Promotion>, which often means a 'filter' query param.
  // For simplicity, we'll include page and size. A filter string can be added.
  listPromotions: (page: number = 1, size: number = 10, filter?: string) => {
    const params = new URLSearchParams({
      page: (page - 1).toString(), // BE Pageable is 0-indexed
      size: size.toString(),
    });
    if (filter) {
      params.append("filter", filter); // Adjust param name if spring-filter uses a different one
    }
    return http.get<PromotionListResType>(`${prefix}?${params.toString()}`);
  },

  // GET /api/v1/promotions/active (Fetch All Active Promotions)
  listActivePromotions: () =>
    http.get<PromotionSchemaType[]>(`${prefix}/active`), // BE returns List<ReqPromotionDTO>

  // GET /api/v1/promotions/expired (Fetch All Expired Promotions)
  listExpiredPromotions: () =>
    http.get<PromotionSchemaType[]>(`${prefix}/expired`), // BE returns List<ReqPromotionDTO>

  // GET /api/v1/promotions/{id} (Fetch Promotion By ID)
  getPromotion: (id: number) =>
    http.get<PromotionSchemaType>(`${prefix}/${id}`), // BE returns ReqPromotionDTO

  // POST /api/v1/promotions (Create New Promotion)
  addPromotion: (body: CreatePromotionBodyType) =>
    http.post<PromotionSchemaType>(prefix, body), // BE returns ReqPromotionDTO

  // PUT /api/v1/promotions/{id} (Update Promotion)
  updatePromotion: (id: number, body: UpdatePromotionBodyType) =>
    http.put<PromotionSchemaType>(`${prefix}/${id}`, body), // BE returns ReqPromotionDTO

  // DELETE /api/v1/promotions/{id} (Delete Promotion)
  deletePromotion: (id: number) => http.delete<void>(`${prefix}/${id}`), // BE returns ResponseEntity<Void> HttpStatus.NO_CONTENT

  // PUT /api/v1/promotions/{id}/status (Update Promotion Status Manually)
  updatePromotionStatus: (id: number, body: UpdatePromotionStatusBodyType) =>
    http.put<PromotionSchemaType>(`${prefix}/${id}/status`, body), // BE returns ReqPromotionDTO

  // POST /api/v1/promotions/update-status (Manually Trigger Update All Promotion Statuses)
  // triggerUpdateAllPromotionStatuses: () =>
  //   http.post<void>(`${prefix}/update-status`), // BE returns ResponseEntity<Void> HttpStatus.OK
};

export default promotionsApiRequest;
