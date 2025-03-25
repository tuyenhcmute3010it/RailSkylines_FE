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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="p-4 border rounded-lg w-72 bg-white shadow-md">
          <div className="text-base font-semibold border-b pb-2 mb-2">
            Thông tin hành trình
          </div>
          <div className="flex flex-col space-y-3">
            <div>
              <label className="block text-sm font-medium">Ga đi</label>
              <Input
                type="text"
                placeholder="Ga đi"
                className="w-full mt-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ga đến</label>
              <Input
                type="text"
                placeholder="Ga đến"
                className="w-full mt-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Loại vé</label>
              <div className="flex items-center space-x-3 mt-1">
                <label className="flex items-center space-x-1">
                  <input type="radio" name="tripType" defaultChecked />
                  <span className="text-sm">Một chiều</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input type="radio" name="tripType" />
                  <span className="text-sm">Khứ hồi</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Ngày đi</label>
              <Input
                type="date"
                className="w-full mt-1 text-sm"
                placeholder="Đi ngày"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ngày về</label>
              <Input
                placeholder="Đến ngày"
                type="date"
                className="w-full mt-1 text-sm"
              />
            </div>
            <Button className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700">
              Tìm kiếm
            </Button>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Kháchádasdasd</div>
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
