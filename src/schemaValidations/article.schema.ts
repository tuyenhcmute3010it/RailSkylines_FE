import z from "zod";

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(256),
  content: z.string().min(1),
});

export type ArticleType = z.TypeOf<typeof ArticleSchema>;

export const ArticleListRes = z.object({
  data: z.array(ArticleSchema),
  message: z.string(),
});

export type ArticleListResType = z.TypeOf<typeof ArticleListRes>;

export const ArticleRes = z
  .object({
    data: ArticleSchema,
    message: z.string(),
  })
  .strict();

export type ArticleResType = z.TypeOf<typeof ArticleRes>;

export const CreateArticleBody = z
  .object({
    title: z.string().trim().min(1).max(256),
    content: z.string().trim().min(1),
  })
  .strict();

export type CreateArticleBodyType = z.TypeOf<typeof CreateArticleBody>;

export const UpdateArticleBody = z
  .object({
    title: z.string().trim().min(1).max(256).optional(),
    content: z.string().trim().min(1).optional(),
  })
  .strict();

export type UpdateArticleBodyType = z.TypeOf<typeof UpdateArticleBody>;

export const ArticleIdParam = z.object({
  id: z.coerce.number(),
});

export type ArticleIdParamType = z.TypeOf<typeof ArticleIdParam>;
