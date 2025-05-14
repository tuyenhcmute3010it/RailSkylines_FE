// queries/useArticle.ts

import articlesApiRequest from "@/apiRequests/article";
import { UpdateArticleBodyType } from "@/schemaValidations/article.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetArticleList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["articles", page, size],
    queryFn: () => articlesApiRequest.listArticle(page, size),
  });
};

export const useGetArticle = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => articlesApiRequest.getArticle(id),
    enabled,
  });
};

export const useAddArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articlesApiRequest.addArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
    },
  });
};

export const useUpdateArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateArticleBodyType & { id: number }) =>
      articlesApiRequest.updateArticle(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
    },
  });
};

export const useDeleteArticleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articlesApiRequest.deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
    },
  });
};
