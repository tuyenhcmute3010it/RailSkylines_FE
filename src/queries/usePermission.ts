// src/queries/usePermission.ts
import permissionsApiRequest from "@/apiRequests/permission";
import { UpdatePermissionBodyType } from "@/schemaValidations/permission.schema";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPermissionList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["permissions", page, size],
    queryFn: () => permissionsApiRequest.listPermission(page, size),
  });
};

export const useGetPermission = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["permissions", id],
    queryFn: () => permissionsApiRequest.getPermission(id),
    enabled,
  });
};

export const useAddPermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permissionsApiRequest.addPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
};

export const useUpdatePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdatePermissionBodyType & { id: number }) =>
      permissionsApiRequest.updatePermission(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
};

export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: permissionsApiRequest.deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
};
