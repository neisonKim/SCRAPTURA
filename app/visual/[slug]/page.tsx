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
import Image from "next/image";
import { visualEntries } from "../../../data/exploration";
import ExplorationPager from "../../../components/ExplorationPager";

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


type VisualRecord = {
  id: string;

  type: "visual";

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  overview?: string;

  heroImage: string;

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
   * 동일 관계 중복 제거
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
 * FIRESTORE VISUAL
 * =====================================
 */

const getVisual =
  cache(
    async (
      slugValue: string
    ): Promise<
      VisualRecord | null
    > => {

      const slug =
        slugValue
          .trim()
          .toLowerCase();


      if (!slug) {
        return null;
      }

      const curated = visualEntries.find(visual => visual.slug === slug);
      if (curated) return { ...curated, id: `local__visual__${slug}`, scripture: curated.scripture ?? [], relations: curated.relations ?? [] };


      /*
       * Firestore Document ID
       *
       * visual__david-goliath-the-valley
       * visual__david-goliath-the-battle
       * ...
       */

      const documentId =
        `visual__${slug}`;


      const snapshot =
        await adminDb
          .collection(
            "contents"
          )
          .doc(
            documentId
          )
          .get().catch(error => {
            console.error("[Visual] Public content lookup failed", error);
            return null;
          });


      if (
        !snapshot?.exists
      ) {
        return null;
      }


      const data =
        snapshot.data();


      if (!data) {
        return null;
      }


      /*
       * 공개 Visual만 허용
       */

      if (
        data.type !==
          "visual" ||
        data.status !==
          "published"
      ) {
        return null;
      }


      return {

        id:
          snapshot.id,

        type:
          "visual",

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


  const visual =
    await getVisual(
      slug
    );


  if (!visual) {

    return {

      title:
        "Visual Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },

    };
  }


  const title =
    `${visual.titleKo} — ${visual.titleEn}`;


  return {

    title,

    description:
      visual.summary,

    alternates: {

      canonical:
        `/visual/${visual.slug}`,

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
        visual.summary,

      url:
        `/visual/${visual.slug}`,

      images:
        visual.heroImage
          ? [
              {
                url:
                  visual.heroImage,

                alt:
                  title,
              },
            ]
          : undefined,

    },

    twitter: {

      card:
        visual.heroImage
          ? "summary_large_image"
          : "summary",

      title:
        `${title} | SCRAPTURA`,

      description:
        visual.summary,

      images:
        visual.heroImage
          ? [
              visual.heroImage,
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


  const visual =
    await getVisual(
      slug
    );


  if (!visual) {
    return notFound();
  }

  const curated = visualEntries.find(item => item.slug === visual.slug);


  return (

    <main>

      {/* =================================
          HERO
      ================================= */}

      <Hero
        eyebrow={
          visual.eyebrow
        }
        titleKo={
          visual.titleKo
        }
        titleEn={
          visual.titleEn
        }
        summary={
          visual.summary
        }
        image={
          visual.heroImage
        }
      />


      <div
        className="contentWrap"
      >
        {curated && <figure className="visualDetailGallery">
          <Image src={visual.heroImage} alt={`${visual.titleKo} — ${visual.summary}`} width={1536} height={1024} sizes="(max-width: 700px) 100vw, 1180px" />
          <figcaption>{visual.titleKo} · 성경 본문을 바탕으로 재구성한 장면</figcaption>
        </figure>}

        {curated && (
          <section className="visualObservations" aria-labelledby="visual-observation-title">
            <small>LOOK CLOSER</small><h3 id="visual-observation-title">장면을 읽는 세 가지 시선</h3>
            <div className="visualObservationGrid">
              {curated.observations.map((point, index) => (
                <article key={point.title}><small>{String(index + 1).padStart(2, "0")} · {curated.scripture?.[index]}</small><h4>{point.title}</h4><p>{point.description}</p></article>
              ))}
            </div>
          </section>
        )}

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
            {visual.titleKo}
            {" "}
            탐험
          </h3>

          <p>
            {
              visual.overview ??
              visual.summary
            }
          </p>

        </section>


        {/* =================================
            VISUAL RECONSTRUCTION
        ================================= */}

        <section
          className="journey"
        >

          <small>
            VISUAL RECONSTRUCTION
          </small>

          <h3>
            시각적 재구성
          </h3>

          <p>
            이 이미지는 성경 본문에 기록된
            인물, 장소와 사건을 바탕으로
            장면을 시각적으로 재구성한
            자료입니다.
          </p>

        </section>


        {/* =================================
            SCRIPTURE
        ================================= */}

        {visual
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
              관련 성경 기록
            </h3>

            <p>
              {visual
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
            visual.relations
          }
        />
        <ExplorationPager type="visual" slug={visual.slug} />

      </div>

    </main>

  );
}
