import accountApiRequest from "@/apiRequests/account";
import {
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAccountList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["accounts", page, size],
    queryFn: () => accountApiRequest.list(page, size),
  });
};

export const useGetAccount = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled,
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      avatarFile,
    }: {
      body: CreateEmployeeAccountBodyType;
      avatarFile?: File;
    }) => accountApiRequest.addEmployee(body, avatarFile),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
      avatarFile,
    }: {
      id: number;
      body: UpdateEmployeeAccountBodyType;
      avatarFile?: File;
    }) => accountApiRequest.updateEmployee(id, body, avatarFile),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: () => accountApiRequest.me(),
  });
};
