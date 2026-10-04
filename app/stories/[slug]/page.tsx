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

import {
  getNode,
} from "../../../data/content";

import {
  getBiblePackageNode,
} from "../../../data/bible/package-loader";


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

  type:
    "story";

  slug:
    string;

  titleKo:
    string;

  titleEn:
    string;

  eyebrow:
    string;

  summary:
    string;

  overview?:
    string;

  heroImage:
    string;

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

  return typeof value ===
    "string"
    ? value
    : "";
}


function normalizeScenes(
  value: unknown
): StoryScene[] {

  if (
    !Array.isArray(
      value
    )
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
    !Array.isArray(
      value
    )
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
    .filter(
      Boolean
    );
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
    !Array.isArray(
      value
    )
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
   * 동일 대상 Relation 중복 제거
   */

  return Array.from(
    new Map(
      normalized.map(
        (
          relation
        ) => [
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
 * LOCAL STORY FALLBACK
 * =====================================
 */


function getLocalStory(
  slugValue: string
): StoryRecord | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();

  if (!slug) {
    return null;
  }

  const packageNode =
    getBiblePackageNode(
      "story",
      slug
    );

  if (packageNode) {

    return {
      id:
        "package__" + slug,

      type:
        "story",

      slug:
        normalizeString(
          packageNode.slug
        ) || slug,

      titleKo:
        normalizeString(
          packageNode.titleKo
        ),

      titleEn:
        normalizeString(
          packageNode.titleEn
        ),

      eyebrow:
        normalizeString(
          packageNode.eyebrow
        ),

      summary:
        normalizeString(
          packageNode.summary
        ),

      overview:
        normalizeString(
          packageNode.overview
        ) || undefined,

      heroImage:
        normalizeString(
          packageNode.heroImage
        ) ||
        "/assets/scraptura-home-clean.jpg",

      scenes:
        normalizeScenes(
          packageNode.scenes
        ),

      scripture:
        normalizeScripture(
          packageNode.scripture
        ),

      relations:
        normalizeRelations(
          packageNode.relations
        ),
    };
  }

  const local =
    getNode(
      "story",
      slug
    );

  if (!local) {
    return null;
  }

  return {
    id:
      "local__" + local.slug,

    type:
      "story",

    slug:
      local.slug,

    titleKo:
      local.titleKo,

    titleEn:
      local.titleEn,

    eyebrow:
      local.eyebrow,

    summary:
      local.summary,

    overview:
      local.overview,

    heroImage:
      local.heroImage,

    scenes:
      local.scenes ?? [],

    scripture:
      local.scripture ?? [],

    relations:
      local.relations ?? [],
  };
}


/*
 * =====================================
 * FIRESTORE + PACKAGE/LOCAL STORY
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
       * 먼저 content.ts에서
       * fallback Story 확보
       */

      const localStory =
        getLocalStory(
          slug
        );


      /*
       * Firestore importer 문서 ID
       *
       * story__david-and-goliath
       * story__david-is-anointed
       * story__ten-commandments
       * ...
       */

      const documentId =
        `story__${slug}`;


      try {

        const snapshot =
          await adminDb
            .collection(
              "contents"
            )
            .doc(
              documentId
            )
            .get();


        /*
         * Firestore 문서가 없다면
         * content.ts Story 사용
         */

        if (
          !snapshot.exists
        ) {

          return localStory;
        }


        const data =
          snapshot.data();


        if (!data) {

          return localStory;
        }


        /*
         * Firestore에 실제 문서가 존재하지만
         * 비공개 상태라면 공개하지 않음
         */

        if (
          data.type !==
            "story" ||
          data.status !==
            "published"
        ) {

          return null;
        }


        /*
         * Firestore 우선
         * 빈 데이터는 local fallback
         */

        return {
          id:
            snapshot.id,

          type:
            "story",

          slug,

          titleKo:
            normalizeString(
              data.titleKo
            ) ||
            localStory?.titleKo ||
            "",

          titleEn:
            normalizeString(
              data.titleEn
            ) ||
            localStory?.titleEn ||
            "",

          eyebrow:
            normalizeString(
              data.eyebrow
            ) ||
            localStory?.eyebrow ||
            "",

          summary:
            normalizeString(
              data.summary
            ) ||
            localStory?.summary ||
            "",

          overview:
            normalizeString(
              data.overview
            ) ||
            localStory?.overview ||
            undefined,

          heroImage:
            normalizeString(
              data.heroImage
            ) ||
            localStory?.heroImage ||
            "",


          scenes:
            (() => {

              const firestoreScenes =
                normalizeScenes(
                  data.scenes
                );


              if (
                firestoreScenes.length >
                0
              ) {

                return firestoreScenes;
              }


              return (
                localStory
                  ?.scenes ??
                []
              );
            })(),


          scripture:
            (() => {

              const firestoreScripture =
                normalizeScripture(
                  data.scripture
                );


              if (
                firestoreScripture.length >
                0
              ) {

                return firestoreScripture;
              }


              return (
                localStory
                  ?.scripture ??
                []
              );
            })(),


          relations:
            (() => {

              const firestoreRelations =
                normalizeRelations(
                  data.relations
                );


              if (
                firestoreRelations.length >
                0
              ) {

                return firestoreRelations;
              }


              return (
                localStory
                  ?.relations ??
                []
              );
            })(),
        };

      }
      catch (
        error
      ) {

        /*
         * Firestore 접근 오류가 있어도
         * content.ts Story가 있으면 페이지 유지
         */

        if (
          localStory
        ) {

          console.warn(
            `[SCRAPTURA] Firestore story fallback: ${slug}`,
            error
          );


          return localStory;
        }


        console.error(
          `[SCRAPTURA] Failed to load story: ${slug}`,
          error
        );


        return null;
      }
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
            {
              story.titleKo
            }
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

        {
          story
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

                {
                  story.scenes.map(
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

                          {
                            hasImage && (

                              <div
                                className="storySceneImage"
                                style={{
                                  backgroundImage:
                                    `url("${scene.image}")`,
                                }}
                                aria-hidden="true"
                              />

                            )
                          }


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
                  )
                }

              </div>

            </section>

          )
        }


        {/* =================================
            SCRIPTURE
        ================================= */}

        {
          story
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
                {
                  story
                    .scripture
                    .join(
                      " · "
                    )
                }
              </p>

            </section>

          )
        }


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