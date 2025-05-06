"use client";

import Link from "next/link";
import { generateSlugUrl } from "@/lib/utils";
import { useGetArticleList } from "@/queries/useArticle";
import ArticleListSkeleton from "./SkeletonTable";

export default function ArticleList() {
  const page = 1;
  const pageSize = 8;

  const articleListQuery = useGetArticleList(page, pageSize);
  const articles = articleListQuery.data?.payload.data.result ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {articleListQuery.isLoading ? (
          <ArticleListSkeleton />
        ) : articleListQuery.error ? (
          <p className="text-red-500 col-span-4 text-center">
            Error: {articleListQuery.error.message}
          </p>
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article.articleId}
              className="flex flex-col items-start space-y-2"
            >
              <Link
                href={`/article/${generateSlugUrl({
                  name: article.title,
                  id: article.articleId,
                })}`}
                className="block"
              >
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-80 h-40 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </Link>
              <Link
                href={`/article/${generateSlugUrl({
                  name: article.title,
                  id: article.articleId,
                })}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {article.title.toUpperCase()}
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center">No articles found.</p>
        )}
      </div>
    </div>
  );
}
