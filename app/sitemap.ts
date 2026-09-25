import type { MetadataRoute } from "next";
import {
  nodes,
  type ContentType,
} from "../data/content";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

const routeByType: Record<
  ContentType,
  string
> = {
  story: "stories",
  person: "people",
  place: "places",
  period: "timeline",
  book: "bible",
  visual: "visual",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${siteUrl}/stories`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/people`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/places`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/timeline`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/bible`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/visual`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/journeys`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const contentRoutes: MetadataRoute.Sitemap =
    nodes.map((node) => ({
      url: `${siteUrl}/${
        routeByType[node.type]
      }/${node.slug}`,

      changeFrequency:
        "monthly" as const,

      priority: 0.7,
    }));

  return [
    ...staticRoutes,
    ...contentRoutes,
  ];
}