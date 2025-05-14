import {
  formatCurrency,
  generateSlugUrl,
  htmlToTextForDescription,
} from "@/lib/utils";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import envConfig from "@/config";
import Train from "@/app/(public)/train";
import SearchTicket from "./search-ticket";
import ArticleTable from "../manage/articles/article-table";
import ArticleList from "@/components/article-list";
import PromotionDisplay from "@/components/promotionDisplay";

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
  console.log("Rendering Home", { Train, SearchTicket, ArticleTable });
  const t = await getTranslations("HomePage");
  return (
    <div className="w-full space-y-4">
      {/* Banner Section */}
      <div className="relative z-10 min-h-[450px]">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-10 z-10"></span>
        <Image
          src="/banner3.png"
          width={900}
          height={300}
          quality={100}
          alt="Banner"
          className="absolute top-0 w-full h-full object-cover opacity-80"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4 text-white">
            {t("description")}
          </p>
        </div>
        <div className="absolute bottom-[0px] left-0 w-full z-30 bg-white/30 h-[70px]">
          <div className="w-full py-4">
            <Train />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <div className="w-full border rounded-lg bg-white shadow-md p-4">
          <SearchTicket />
        </div>
        <div className="col-span-2 border rounded-lg bg-white shadow-md p-4">
          <div className="text-sm font-medium">
            <Image
              src="/banner2.jpg"
              width={1000}
              height={1000}
              quality={100}
              alt="Train Head"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="w-full border rounded-lg bg-white shadow-md p-4">
          <PromotionDisplay />
        </div>
      </div>

      <section className="space-y-10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ArticleList />
        </div>
      </section>
    </div>
  );
}
