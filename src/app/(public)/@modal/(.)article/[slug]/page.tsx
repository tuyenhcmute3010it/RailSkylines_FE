"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getIdFromSlugUrl } from "@/lib/utils";
import articlesApiRequest from "@/apiRequests/article";
import Modal from "./modal";
import ArticleDetail from "@/app/(public)/article/[slug]/article-detail";

export default function ArticleModalPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const id = getIdFromSlugUrl(slug);
        const data = await articlesApiRequest.getArticle(Number(id));
        setArticle(data?.payload?.data);
      } catch (err) {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Modal>
      <ArticleDetail article={article} />
    </Modal>
  );
}
