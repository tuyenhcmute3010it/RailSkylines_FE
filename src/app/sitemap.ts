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
  const staticSiteMap = staticRoutes.map((route) => {
    return {
      ...route,
      url: `${envConfig.NEXT_PUBLIC_URL}${route.url}`,
      lastModified: new Date(),
    };
  });

  return [...staticSiteMap];
}
