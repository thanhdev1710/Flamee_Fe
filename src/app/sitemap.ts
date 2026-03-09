import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://flame.id.vn/vi",
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://flame.id.vn/vi/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://flame.id.vn/vi/auth/signin",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flame.id.vn/vi/auth/signup",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://flame.id.vn/vi/events",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://flame.id.vn/vi/contact",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
