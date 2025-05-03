import http from "@/lib/http";
import {
  CreateRoleBodyType,
  RoleListResType,
  RoleResType,
  UpdateRoleBodyType,
} from "@/schemaValidations/role.schema";

const prefix = "/api/v1/roles";

const rolesApiRequest = {
  listRole: (page: number = 1, size: number = 10) =>
    http.get<RoleListResType>(`${prefix}?page=${page}&size=${size}`),
  addRole: (body: CreateRoleBodyType) => http.post<RoleResType>(prefix, body),
  updateRole: (id: number, body: UpdateRoleBodyType) =>
    http.put<RoleResType>(`${prefix}/${id}`, body),
  getRole: (id: number) => http.get<RoleResType>(`${prefix}/${id}`),
  deleteRole: (id: number) => http.delete<RoleResType>(`${prefix}/${id}`),
};

export default rolesApiRequest;
