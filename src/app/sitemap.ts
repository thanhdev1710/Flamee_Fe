import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://flamee.com",
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://flamee.com/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://flamee.com/signin",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flamee.com/signup",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flamee.com/feed",
      lastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://flamee.com/terms",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://flamee.com/privacy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
