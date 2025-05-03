// src/apiRequests/permission.ts
import http from "@/lib/http";
import {
  CreatePermissionBodyType,
  PermissionListResType,
  PermissionResType,
  UpdatePermissionBodyType,
} from "@/schemaValidations/permission.schema";

const prefix = "/api/v1/permissions";

const permissionsApiRequest = {
  listPermission: (page: number = 1, size: number = 10) =>
    http.get<PermissionListResType>(`${prefix}?page=${page}&size=${size}`),
  addPermission: (body: CreatePermissionBodyType) =>
    http.post<PermissionResType>(prefix, body),
  updatePermission: (id: number, body: UpdatePermissionBodyType) =>
    http.put<PermissionResType>(`${prefix}/${id}`, body),
  getPermission: (id: number) => http.get<PermissionResType>(`${prefix}/${id}`),
  deletePermission: (id: number) =>
    http.delete<PermissionResType>(`${prefix}/${id}`),
};

export default permissionsApiRequest;
