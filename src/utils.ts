import { ROUTES } from "./consts";

export const createBlogUrl = (slug: string) => {
  return `${ROUTES.blog}/${slug}`;
};
