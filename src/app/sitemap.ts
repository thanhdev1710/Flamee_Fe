import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://flamee-fe.vercel.app",
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://flamee-fe.vercel.app/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://flamee-fe.vercel.app/signin",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flamee-fe.vercel.app/signup",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flamee-fe.vercel.app/feed",
      lastModified,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://flamee-fe.vercel.app/terms",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://flamee-fe.vercel.app/privacy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
