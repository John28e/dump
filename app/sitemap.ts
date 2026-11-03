import type { MetadataRoute } from "next";
import { PLACEHOLDER_PROJECTS } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://identity-pied.vercel.app";

  const projectRoutes: MetadataRoute.Sitemap = PLACEHOLDER_PROJECTS.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date("2026-11-01"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-11-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
