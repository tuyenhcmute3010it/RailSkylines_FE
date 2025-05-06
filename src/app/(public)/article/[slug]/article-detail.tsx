"use client";
import React, { useState } from "react";
import { ArticleSchemaType } from "@/schemaValidations/article.schema";

export default function ArticleDetail({
  article,
}: {
  article: ArticleSchemaType | undefined;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    });
  };

  if (!article)
    return (
      <div className="p-4">
        <h1 className="text-2xl lg:text-3xl font-bold uppercase">
          Bài Báo Không Tồn Tại
        </h1>
      </div>
    );

  const detailsSection =
    article.content.split("\n\n").slice(1).join("\n\n") || "";
  const detailsHeader = detailsSection.split(".")[0] || "";

  return (
    <div className="space-y-4 max-w-3xl mx-auto p-4">
      <h1 className="text-2xl lg:text-3xl font-bold uppercase text-center">
        {article.title}
      </h1>
      {article.thumbnail ? (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-80 h-40 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="flex items-center space-x-2 text-sm text-gray-600 justify-between bg-gray-100 p-2">
        <span>Author : Admin RailSkylines</span>
        <button
          className="bg-gray-200 px-2 py-1 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Chia sẻ
        </button>
      </div>
      <div className="prose">
        <p className="font-bold uppercase">{detailsHeader.toUpperCase()}</p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h2>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {copyStatus}
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded w-full"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
