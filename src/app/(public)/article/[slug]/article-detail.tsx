import { ArticleSchemaType } from "@/schemaValidations/article.schema";

export default function ArticleDetail({
  article,
}: {
  article: ArticleSchemaType | undefined;
}) {
  if (!article)
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">
          Bài Báo Không Tồn Tại
        </h1>
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{article.title}</h1>
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="object-cover w-[300px] h-[300px] rounded-md"
          title={article.title}
        />
      )}
      <p>{article.content}</p>
    </div>
  );
}
