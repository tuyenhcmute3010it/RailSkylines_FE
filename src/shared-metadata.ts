import { url } from "inspector";
import envConfig from "./config";

export const baseOpenGraph = {
  locale: "en_US",
  alternateLocale: ["vi_VN"],
  type: "website",
  siteName: "Savannah Restaurant",
  images: [
    {
      url: `${envConfig.NEXT_PUBLIC_URL}/banner.png`,
    },
  ],
};
