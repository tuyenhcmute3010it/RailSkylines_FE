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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchTicket from "./search-ticket";
import { SearchParams } from "next/dist/server/request/search-params";
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

interface SearchTicketProps {
  onSearch: (params: SearchParams) => void;
}
export default async function Home() {
  const resetDateFilter = () => {};
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
          className="absolute top-90 w-full h-full object-cover opacity-80"
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
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <div className="w-full border rounded-lg w-72 bg-white shadow-md p-4">
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
              className="w-[1000px] h-auto"
            />
            <Image
              src="/banner3.png"
              width={1000}
              height={1000}
              quality={100}
              alt="Train Head"
              className="w-[1000px] h-auto"
            />
            <Image
              src="/banner.webp"
              width={1000}
              height={1000}
              quality={100}
              alt="Train Head"
              className="w-[1000px] h-auto"
            />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="w-full border rounded-lg bg-white shadow-md p-4">
          <div className="text-sm font-medium">
            <Image
              src="/banner3.png"
              width={1000}
              height={1000}
              quality={100}
              alt="Train Head"
              className="w-[1000px] h-auto"
            />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">{t("diversity")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10"></div>
      </section>
    </div>
  );
}
