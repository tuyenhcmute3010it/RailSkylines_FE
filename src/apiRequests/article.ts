// apiRequests/article.ts
import http from "@/lib/http";
import {
  ArticleListResType,
  ArticleResType,
  CreateArticleBodyType,
  UpdateArticleBodyType,
} from "@/schemaValidations/article.schema";

const prefix = "/api/v1/articles";

const articlesApiRequest = {
  listArticle: (page: number = 1, size: number = 10) =>
    http.get<ArticleListResType>(`${prefix}?page=${page}&size=${size}`),
  addArticle: (body: CreateArticleBodyType) =>
    http.post<ArticleResType>(`${prefix}`, body),
  updateArticle: (id: number, body: UpdateArticleBodyType) =>
    http.put<ArticleResType>(`${prefix}/${id}`, body),
  getArticle: (id: number) => http.get<ArticleResType>(`${prefix}/${id}`),
  deleteArticle: (id: number) => http.delete<ArticleResType>(`${prefix}/${id}`),
};

export default articlesApiRequest;
