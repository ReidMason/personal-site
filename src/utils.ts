import { ROUTES } from "./consts";

export const createBlogUrl = (slug: string) => {
  return `${ROUTES.blog}/${slug}`;
};

export const formatDate = (date: Date) => {
  var options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
};
