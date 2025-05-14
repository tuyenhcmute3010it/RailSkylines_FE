"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { generateSlugUrl } from "@/lib/utils";
import { useGetArticleList } from "@/queries/useArticle";

const MarqueeTrain = () => {
  return (
    <div className="w-full bg-blue overflow-hidden py-2 text-white whitespace-nowrap relative">
      <div className="flex w-max animate-marquee">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

const MarqueeContent = () => {
  const page = 1;
  const pageSize = 8;

  const articleListQuery = useGetArticleList(page, pageSize);
  const articles = articleListQuery.data?.payload.data.result ?? [];

  return (
    <div className="flex gap-10">
      {articleListQuery.isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Notification
              key={index}
              label="Thông báo:"
              text="Đang tải..."
              link="#"
            />
          ))
        : articles.length > 0
        ? articles.map((article) => (
            <Notification
              key={article.articleId}
              label="Thông báo:"
              text={article.title}
              link={`/article/${generateSlugUrl({
                name: article.title,
                id: article.articleId,
              })}`}
            />
          ))
        : null}
    </div>
  );
};

interface NotificationProps {
  label: string;
  text: string;
  link: string;
}

const Notification: React.FC<NotificationProps> = ({ label, text, link }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center text-lg gap-3 relative top-[-5px]">
        <Image
          src="/train-head1.png"
          width={60}
          height={30}
          quality={100}
          alt="Train Head"
          className="w-[60px] h-auto"
        />
      </div>
      <div className="flex flex-col items-start">
        <div>
          <span className="font-bold text-yellow-400 mr-2 text-xl">
            {label}
          </span>
          <Link
            href={link}
            className="text-white hover:underline text-3xl font-extrabold drop-shadow-xl"
          >
            {text}
          </Link>
        </div>
        <div className="w-auto h-5 overflow-hidden">
          <Image
            src="/train.png"
            width={900}
            height={40}
            quality={100}
            alt="Train Car"
            className="h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default MarqueeTrain;
