import type {
  MetadataRoute,
} from "next";

import {
  nodes,
} from "../data/content";

import type {
  ContentType,
} from "../data/content";

import {
  journeys,
} from "../data/journeys";


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


  /* =====================================================
     STATIC ROUTES
     ===================================================== */

  const staticPaths = [

    "/",

    "/stories",

    "/people",

    "/places",

    "/timeline",

    "/bible",

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


  /* =====================================================
     CONTENT ROUTES
     ===================================================== */

  const contentPaths =
    nodes.map(
      (node) =>
        `${
          ROUTE_PREFIX[
            node.type
          ]
        }/${
          encodeURIComponent(
            node.slug
          )
        }`
    );


  const uniqueContentPaths =
    Array.from(
      new Set(
        contentPaths
      )
    );


  const contentEntries:
    MetadataRoute.Sitemap =
    uniqueContentPaths.map(
      (path) => ({

        url:
          `${SITE_URL}${path}`,

      })
    );


  /* =====================================================
     JOURNEY ROUTES
     ===================================================== */

  const journeyEntries:
    MetadataRoute.Sitemap =
    journeys.map(
      (journey) => ({

        url:
          `${SITE_URL}/journeys/${
            encodeURIComponent(
              journey.slug
            )
          }`,

      })
    );


  /* =====================================================
     RESULT
     ===================================================== */

  return [

    ...staticEntries,

    ...contentEntries,

    ...journeyEntries,

  ];

}