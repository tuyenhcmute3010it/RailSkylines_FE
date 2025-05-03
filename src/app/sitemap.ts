import dishesApiRequest from "@/apiRequests/dish";
import envConfig from "@/config";
import { generateSlugUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: "",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.5,
  },
];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await dishesApiRequest.list();
  const dishList = result.payload.data;
  const staticSiteMap = staticRoutes.map((route) => {
    return {
      ...route,
      url: `${envConfig.NEXT_PUBLIC_URL}${route.url}`,
      lastModified: new Date(),
    };
  });
  const dishSiteMap: MetadataRoute.Sitemap = dishList.map((dish) => {
    return {
      url: `${envConfig.NEXT_PUBLIC_URL}/dishes/${generateSlugUrl({
        id: dish.id,
        name: dish.name,
      })}`,
      lastModified: dish.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    };
  });
  return [...staticSiteMap, ...dishSiteMap];
}
