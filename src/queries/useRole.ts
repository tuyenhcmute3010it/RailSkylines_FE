// //////////////////////////////////////////////////////////////////////
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import rolesApiRequest from "@/apiRequests/role";
// import {
//   RoleListResType,
//   RoleResType,
//   CreateRoleBodyType,
//   UpdateRoleBodyType,
// } from "@/schemaValidations/role.schema";

// export const useGetRoleList = (page: number, pageSize: number) => {
//   return useQuery<RoleListResType>({
//     queryKey: ["roles", page, pageSize],
//     queryFn: () => rolesApiRequest.listRole(page, pageSize),
//   });
// };

// export const useGetRole = ({
//   id,
//   enabled,
// }: {
//   id: number;
//   enabled: boolean;
// }) => {
//   return useQuery<RoleResType>({
//     queryKey: ["role", id],
//     queryFn: async () => {
//       const response = await rolesApiRequest.getRole(id);
//       // Transform the nested response to match RoleResType
//       return {
//         status: response.status,
//         payload: response.payload.payload, // Extract the inner payload
//       };
//     },
//     enabled,
//   });
// };

// export const useAddRoleMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (body: CreateRoleBodyType) => rolesApiRequest.addRole(body),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
//     },
//   });
// };

// export const useUpdateRoleMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, body }: { id: number; body: UpdateRoleBodyType }) =>
//       rolesApiRequest.updateRole(id, body),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
//       queryClient.invalidateQueries({ queryKey: ["role"], exact: false });
//     },
//   });
// };

// export const useDeleteRoleMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: number) => rolesApiRequest.deleteRole(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
//     },
//   });
// };

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import rolesApiRequest from "@/apiRequests/role";
import {
  RoleListResType,
  RoleResType,
  CreateRoleBodyType,
  UpdateRoleBodyType,
} from "@/schemaValidations/role.schema";

export const useGetRoleList = (page: number, pageSize: number) => {
  return useQuery<RoleListResType>({
    queryKey: ["roles", page, pageSize],
    queryFn: () => rolesApiRequest.listRole(page, pageSize),
  });
};

export const useGetRole = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery<RoleResType>({
    queryKey: ["role", id],
    queryFn: () => rolesApiRequest.getRole(id), // Use the raw response
    enabled,
  });
};

export const useAddRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRoleBodyType) => rolesApiRequest.addRole(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
    },
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateRoleBodyType }) =>
      rolesApiRequest.updateRole(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["role"], exact: false });
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rolesApiRequest.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"], exact: false });
    },
  });
};
