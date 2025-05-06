import articlesApiRequest from "@/apiRequests/article";
import {
  generateSlugUrl,
  getIdFromSlugUrl,
  htmlToTextForDescription,
  wrapServerApi,
} from "@/lib/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import envConfig from "@/config";
import { baseOpenGraph } from "@/shared-metadata";
import ArticleDetail from "./article-detail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("ArticleDetail");
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() =>
    articlesApiRequest.getArticle(Number(id))
  );
  const article = data?.payload?.data;
  if (!article) {
    return {
      title: t("notFound"),
      description: t("notFound"),
    };
  }
  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/article/${generateSlugUrl({
      name: article.title,
      id: article.articleId,
    })}`;
  return {
    title: article.title,
    description: htmlToTextForDescription(article.content),
    openGraph: {
      ...baseOpenGraph,
      title: article.title,
      description: article.content,
      url,
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.content,
      images: article.thumbnail ? [article.thumbnail] : [],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() =>
    articlesApiRequest.getArticle(Number(id))
  );
  const article = data?.payload?.data;

  return <ArticleDetail article={article} />;
}
