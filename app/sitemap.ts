import type {
  MetadataRoute,
} from "next";

import {
  nodes,
} from "../data/content";

import type {
  ContentType,
} from "../data/content";


const SITE_URL =
  (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(
    /\/$/,
    ""
  );


const ROUTE_PREFIX:
  Record<
    ContentType,
    string
  > = {

    story:
      "/stories",

    person:
      "/people",

    place:
      "/places",

    period:
      "/timeline",

    book:
      "/bible",

    visual:
      "/visual",
  };


export default function sitemap():
  MetadataRoute.Sitemap {

  const staticPaths = [
    "/",
    "/bible",
    "/stories",
    "/people",
    "/places",
    "/timeline",
    "/visual",
    "/journeys",
    "/search",
  ];


  const staticEntries:
    MetadataRoute.Sitemap =
    staticPaths.map(
      (path) => ({
        url:
          `${SITE_URL}${path}`,
      })
    );


  const detailPaths =
    nodes.map(
      (node) =>
        `${
          ROUTE_PREFIX[
            node.type
          ]
        }/${encodeURIComponent(
          node.slug
        )}`
    );


  const uniqueDetailPaths =
    Array.from(
      new Set(
        detailPaths
      )
    );


  const detailEntries:
    MetadataRoute.Sitemap =
    uniqueDetailPaths.map(
      (path) => ({
        url:
          `${SITE_URL}${path}`,
      })
    );


  return [
    ...staticEntries,
    ...detailEntries,
  ];
}