import { defineCollection, z } from "astro:content";

export const collections = {
  blogs: defineCollection({
    schema: z
      .object({
        title: z.string(),
        description: z.string(),
        date: z.date().transform((str) => new Date(str)),
      })
      .strict(),
  }),
};
