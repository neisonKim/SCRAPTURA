import type {
  Metadata,
} from "next";

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

type CharacterStage = {
  number: string;
  title: string;
  scripture: string;
  description: string;
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


type PersonRecord = {
  id: string;

  type: "person";

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  overview?: string;

  heroImage: string;

  characterJourney:
    CharacterStage[];

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


function normalizeCharacterJourney(
  value: unknown
): CharacterStage[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }


  return value
    .map(
      (
        item
      ): CharacterStage | null => {

        if (
          typeof item !==
            "object" ||
          item === null
        ) {
          return null;
        }


        const data =
          item as
            Record<string, unknown>;


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
        };
      }
    )
    .filter(
      (
        item
      ): item is CharacterStage =>
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
   * 동일 대상 Relation 중복 제거
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
 * FIRESTORE PERSON
 * =====================================
 *
 * Importer에서 문서 ID를
 * person__slug 형식으로 저장했기 때문에
 * 직접 문서를 조회합니다.
 */

const getPerson =
  cache(
    async (
      slugValue: string
    ): Promise<
      PersonRecord | null
    > => {

      const slug =
        slugValue
          .trim()
          .toLowerCase();


      if (!slug) {
        return null;
      }


      const documentId =
        `person__${slug}`;


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
       * 공개된 person만 허용
       */

      if (
        data.type !==
          "person" ||
        data.status !==
          "published"
      ) {
        return null;
      }


      return {
        id:
          snapshot.id,

        type:
          "person",

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
          ) || undefined,

        heroImage:
          normalizeString(
            data.heroImage
          ),

        characterJourney:
          normalizeCharacterJourney(
            data.characterJourney
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


  const person =
    await getPerson(
      slug
    );


  if (!person) {
    return {
      title:
        "Person Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }


  const title =
    `${person.titleKo} — ${person.titleEn}`;


  return {
    title,

    description:
      person.summary,

    alternates: {
      canonical:
        `/people/${person.slug}`,
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
        person.summary,

      url:
        `/people/${person.slug}`,

      images:
        person.heroImage
          ? [
              {
                url:
                  person.heroImage,

                alt:
                  title,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        person.heroImage
          ? "summary_large_image"
          : "summary",

      title:
        `${title} | SCRAPTURA`,

      description:
        person.summary,

      images:
        person.heroImage
          ? [
              person.heroImage,
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


  const person =
    await getPerson(
      slug
    );


  if (!person) {
    return notFound();
  }


  return (
    <main>

      {/* =================================
          HERO
      ================================= */}

      <Hero
        eyebrow={
          person.eyebrow
        }
        titleKo={
          person.titleKo
        }
        titleEn={
          person.titleEn
        }
        summary={
          person.summary
        }
        image={
          person.heroImage
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
            {person.titleKo}
            {" "}
            탐험
          </h3>

          <p>
            {
              person.overview ??
              person.summary
            }
          </p>

        </section>


        {/* =================================
            CHARACTER JOURNEY
        ================================= */}

        {person
          .characterJourney
          .length >
          0 && (

          <section
            className="journey characterJourney"
          >

            <div
              className="characterJourneyHeader"
            >

              <small>
                CHARACTER JOURNEY
              </small>

              <h3>
                {person.titleKo}
                의 여정
              </h3>

              <p>
                성경 본문을 따라
                인물의 주요 장면과
                변화를 순서대로
                살펴봅니다.
              </p>

            </div>


            <div
              className="characterJourneyList"
            >

              {person
                .characterJourney
                .map(
                  (
                    stage,
                    index
                  ) => (

                    <article
                      className="characterStage"
                      key={
                        `${stage.number}-${index}`
                      }
                    >

                      <div
                        className="characterStageNumber"
                      >
                        {
                          stage.number
                        }
                      </div>


                      <div
                        className="characterStageContent"
                      >

                        <small>
                          {
                            stage.scripture
                          }
                        </small>

                        <h4>
                          {
                            stage.title
                          }
                        </h4>

                        <p>
                          {
                            stage.description
                          }
                        </p>

                      </div>

                    </article>

                  )
                )}

            </div>

          </section>

        )}


        {/* =================================
            SCRIPTURE
        ================================= */}

        {person
          .scripture
          .length >
          0 && (

          <section
            className="journey"
          >

            <small>
              SCRIPTURE
            </small>

            <h3>
              주요 성경 기록
            </h3>

            <p>
              {person
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
            person.relations
          }
        />

      </div>

    </main>
  );
}