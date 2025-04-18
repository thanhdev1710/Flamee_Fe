import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://flamee.vn",
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://flamee.vn/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://flamee.vn/signin",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flamee.vn/signup",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flamee.vn/feed",
      lastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://flamee.vn/terms",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://flamee.vn/privacy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
