import {
  formatCurrency,
  generateSlugUrl,
  htmlToTextForDescription,
} from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import envConfig from "@/config";
import Train from "@/app/(public)/train";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HomePage");
  return {
    title: t("title"),
    description: htmlToTextForDescription(t("description")),
    alternates: {
      canonical: envConfig.NEXT_PUBLIC_URL,
    },
  };
}
export default async function Home() {
  const t = await getTranslations("HomePage");
  return (
    <div className="w-full space-y-4 ">
      <div className="relative z-10 min-h-[450px]">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-10 z-10"></span>
        <Image
          src="/banner3.png"
          width={900}
          height={300}
          quality={100}
          alt="Banner"
          className="absolute top-90 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4 text-white">
            {t("description")}
          </p>
        </div>

        <div className="absolute bottom-[0px] left-0 w-full z-30 bg-white/40 h-[70px]">
          <div className="w-full py-4">
            <Train />
          </div>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">{t("diversity")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10"></div>
      </section>
    </div>
  );
}
