import dishesApiRequest from "@/apiRequests/dish";
import {
  generateSlugUrl,
  getIdFromSlugUrl,
  htmlToTextForDescription,
  wrapServerApi,
} from "@/lib/utils";
import DishDetail from "./dish-detail";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import envConfig from "@/config";
import { baseOpenGraph } from "@/shared-metadata";
type Props = {
  params: Promise<{ slug: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Sử dụng await
  const t = await getTranslations("DishDetail");
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;
  if (!dish) {
    return {
      title: t("notFound"),
      description: t("notFound"),
    };
  }
  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/dishes/${generateSlugUrl({
      name: dish.name,
      id: dish.id,
    })}`;
  return {
    title: dish.name,
    description: htmlToTextForDescription(dish.description),
    openGraph: {
      ...baseOpenGraph,
      title: dish.name,
      description: dish.description,
      url,
      images: dish.image ? [{ url: dish.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description: dish.description,
      images: dish.image ? [dish.image] : [],
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

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Chỉnh kiểu của params thành Promise
}) {
  const { slug } = await params; // Dùng await để lấy giá trị thực của params
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;

  return <DishDetail dish={dish} />;
}
