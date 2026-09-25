import type {
  Metadata,
} from "next";

import {
  existsSync,
} from "fs";

import {
  join,
} from "path";

import {
  notFound,
} from "next/navigation";

import {
  cache,
} from "react";

import Hero
  from "../../../components/Hero";

import RelationCards
  from "../../../components/RelationCards";

import {
  adminDb,
} from "../../../lib/firebaseAdmin";


/*
 * =====================================
 * TYPES
 * =====================================
 */

type StoryScene = {
  number: string;
  title: string;
  scripture: string;
  description: string;
  image?: string;
};


type RelationTargetType =
  | "person"
  | "place"
  | "story"
  | "period"
  | "book"
  | "visual";


type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_STORY"
  | "RELATED_PERIOD"
  | "RELATED_BOOK";


type Relation = {
  targetType:
    RelationTargetType;

  targetSlug:
    string;

  relationType:
    RelationType;

  label:
    string;
};


type StoryRecord = {
  id: string;

  type: "story";

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  overview?: string;

  heroImage: string;

  scenes:
    StoryScene[];

  scripture:
    string[];

  relations:
    Relation[];
};


/*
 * =====================================
 * NORMALIZERS
 * =====================================
 */

function normalizeString(
  value: unknown
) {
  return typeof value === "string"
    ? value
    : "";
}


function normalizeScenes(
  value: unknown
): StoryScene[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }


  return value
    .map(
      (
        item
      ): StoryScene | null => {

        if (
          typeof item !==
            "object" ||
          item === null
        ) {
          return null;
        }


        const data =
          item as
            Record<
              string,
              unknown
            >;


        const image =
          normalizeString(
            data.image
          ).trim();


        return {
          number:
            normalizeString(
              data.number
            ),

          title:
            normalizeString(
              data.title
            ),

          scripture:
            normalizeString(
              data.scripture
            ),

          description:
            normalizeString(
              data.description
            ),

          image:
            image ||
            undefined,
        };
      }
    )
    .filter(
      (
        item
      ): item is StoryScene =>
        item !== null
    );
}


function normalizeScripture(
  value: unknown
) {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }


  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
          "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);
}


const validTargetTypes =
  new Set<RelationTargetType>([
    "person",
    "place",
    "story",
    "period",
    "book",
    "visual",
  ]);


const validRelationTypes =
  new Set<RelationType>([
    "RELATED_PERSON",
    "RELATED_PLACE",
    "RELATED_STORY",
    "RELATED_PERIOD",
    "RELATED_BOOK",
  ]);


function normalizeRelations(
  value: unknown
): Relation[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }


  const normalized =
    value
      .map(
        (
          item
        ): Relation | null => {

          if (
            typeof item !==
              "object" ||
            item === null
          ) {
            return null;
          }


          const data =
            item as
              Record<
                string,
                unknown
              >;


          const targetType =
            normalizeString(
              data.targetType
            ) as
              RelationTargetType;


          const relationType =
            normalizeString(
              data.relationType
            ) as
              RelationType;


          const targetSlug =
            normalizeString(
              data.targetSlug
            )
              .trim()
              .toLowerCase();


          const label =
            normalizeString(
              data.label
            );


          if (
            !validTargetTypes.has(
              targetType
            ) ||
            !validRelationTypes.has(
              relationType
            ) ||
            !targetSlug
          ) {
            return null;
          }


          return {
            targetType,
            targetSlug,
            relationType,
            label,
          };
        }
      )
      .filter(
        (
          item
        ): item is Relation =>
          item !== null
      );


  /*
   * 같은 대상 Relation 중복 제거
   */

  return Array.from(
    new Map(
      normalized.map(
        (relation) => [
          `${relation.targetType}__${relation.targetSlug}`,
          relation,
        ]
      )
    ).values()
  );
}


/*
 * =====================================
 * SCENE IMAGE
 * =====================================
 */

function sceneImageExists(
  src?: string
) {

  if (!src) {
    return false;
  }


  /*
   * Cloudinary 등 외부 이미지
   */

  if (
    src.startsWith(
      "https://"
    ) ||
    src.startsWith(
      "http://"
    )
  ) {
    return true;
  }


  /*
   * public 폴더 로컬 이미지
   */

  if (
    src.startsWith("/")
  ) {

    return existsSync(
      join(
        process.cwd(),
        "public",
        src.replace(
          /^\//,
          ""
        )
      )
    );
  }


  return false;
}


/*
 * =====================================
 * FIRESTORE STORY
 * =====================================
 */

const getStory =
  cache(
    async (
      slugValue: string
    ): Promise<
      StoryRecord | null
    > => {

      const slug =
        slugValue
          .trim()
          .toLowerCase();


      if (!slug) {
        return null;
      }


      /*
       * Importer 문서 ID
       *
       * story__david-and-goliath
       * story__david-is-anointed
       * ...
       */

      const documentId =
        `story__${slug}`;


      const snapshot =
        await adminDb
          .collection(
            "contents"
          )
          .doc(
            documentId
          )
          .get();


      if (
        !snapshot.exists
      ) {
        return null;
      }


      const data =
        snapshot.data();


      if (!data) {
        return null;
      }


      /*
       * Published Story만 공개
       */

      if (
        data.type !==
          "story" ||
        data.status !==
          "published"
      ) {
        return null;
      }


      return {
        id:
          snapshot.id,

        type:
          "story",

        slug,

        titleKo:
          normalizeString(
            data.titleKo
          ),

        titleEn:
          normalizeString(
            data.titleEn
          ),

        eyebrow:
          normalizeString(
            data.eyebrow
          ),

        summary:
          normalizeString(
            data.summary
          ),

        overview:
          normalizeString(
            data.overview
          ) ||
          undefined,

        heroImage:
          normalizeString(
            data.heroImage
          ),

        scenes:
          normalizeScenes(
            data.scenes
          ),

        scripture:
          normalizeScripture(
            data.scripture
          ),

        relations:
          normalizeRelations(
            data.relations
          ),
      };
    }
  );


/*
 * =====================================
 * METADATA
 * =====================================
 */

export async function generateMetadata({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}): Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  const story =
    await getStory(
      slug
    );


  if (!story) {
    return {
      title:
        "Story Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }


  const title =
    `${story.titleKo} — ${story.titleEn}`;


  return {
    title,

    description:
      story.summary,

    alternates: {
      canonical:
        `/stories/${story.slug}`,
    },

    openGraph: {
      type:
        "article",

      locale:
        "ko_KR",

      siteName:
        "SCRAPTURA",

      title:
        `${title} | SCRAPTURA`,

      description:
        story.summary,

      url:
        `/stories/${story.slug}`,

      images:
        story.heroImage
          ? [
              {
                url:
                  story.heroImage,

                alt:
                  title,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        story.heroImage
          ? "summary_large_image"
          : "summary",

      title:
        `${title} | SCRAPTURA`,

      description:
        story.summary,

      images:
        story.heroImage
          ? [
              story.heroImage,
            ]
          : undefined,
    },
  };
}


/*
 * =====================================
 * PAGE
 * =====================================
 */

export default async function Page({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}) {

  const {
    slug,
  } =
    await params;


  const story =
    await getStory(
      slug
    );


  if (!story) {
    return notFound();
  }


  return (
    <main>

      {/* =================================
          HERO
      ================================= */}

      <Hero
        eyebrow={
          story.eyebrow
        }
        titleKo={
          story.titleKo
        }
        titleEn={
          story.titleEn
        }
        summary={
          story.summary
        }
        image={
          story.heroImage
        }
      />


      <div
        className="contentWrap"
      >

        {/* =================================
            OVERVIEW
        ================================= */}

        <section
          className="overview"
        >

          <small>
            OVERVIEW
          </small>

          <h3>
            {story.titleKo}
            {" "}
            탐험
          </h3>

          <p>
            {
              story.overview ??
              story.summary
            }
          </p>

        </section>


        {/* =================================
            SCENE SEQUENCE
        ================================= */}

        {story
          .scenes
          .length >
          0 && (

          <section
            className="journey"
          >

            <small>
              SCENE SEQUENCE
            </small>

            <h3>
              이야기의 흐름을
              장면별로 따라가세요
            </h3>


            <div
              className="storyScenes"
            >

              {story.scenes.map(
                (
                  scene,
                  index
                ) => {

                  const hasImage =
                    sceneImageExists(
                      scene.image
                    );


                  return (

                    <article
                      className={
                        `storyScene${
                          hasImage
                            ? ""
                            : " storySceneNoImage"
                        }`
                      }
                      key={
                        `${scene.number}-${scene.title}-${index}`
                      }
                    >

                      {hasImage && (

                        <div
                          className="storySceneImage"
                          style={{
                            backgroundImage:
                              `url("${scene.image}")`,
                          }}
                          aria-hidden="true"
                        />

                      )}


                      <div
                        className="storySceneBody"
                      >

                        <div
                          className="storySceneNumber"
                        >
                          {
                            scene.number
                          }
                        </div>


                        <div
                          className="storySceneContent"
                        >

                          <small>
                            {
                              scene.scripture
                            }
                          </small>

                          <h4>
                            {
                              scene.title
                            }
                          </h4>

                          <p>
                            {
                              scene.description
                            }
                          </p>

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          </section>

        )}


        {/* =================================
            SCRIPTURE
        ================================= */}

        {story
          .scripture
          .length >
          0 && (

          <section
            className="scriptureBlock"
          >

            <small>
              SCRIPTURE
            </small>

            <h3>
              본문으로 돌아가기
            </h3>

            <p>
              {story
                .scripture
                .join(
                  " · "
                )}
            </p>

          </section>

        )}


        {/* =================================
            CONNECTIONS
        ================================= */}

        <RelationCards
          items={
            story.relations
          }
        />

      </div>

    </main>
  );
}