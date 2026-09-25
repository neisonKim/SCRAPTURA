import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  cache,
} from "react";

import {
  adminDb,
} from "../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

/*
 * =====================================
 * METADATA
 * =====================================
 */

export const metadata: Metadata = {

  title:
    "Journeys",

  description:
    "성경의 인물, 이야기, 장소, 시대와 본문을 하나의 탐험 경로로 연결하는 SCRAPTURA Journeys입니다.",

  openGraph: {

    title:
      "Journeys | SCRAPTURA",

    description:
      "하나의 질문에서 시작해 성경의 인물, 이야기, 장소와 본문을 연결하며 탐험하세요.",

    url:
      "/journeys",

  },

};


/*
 * =====================================
 * TYPES
 * =====================================
 */

type ContentType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";


type JourneyEntity = {
  id: string;

  type:
    ContentType;

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

  heroImage:
    string;
};


type JourneyStepConfig = {
  type:
    ContentType;

  slug:
    string;

  fallbackTitle:
    string;
};


/*
 * =====================================
 * ROUTES
 * =====================================
 */

const routeByType:
  Record<
    ContentType,
    string
  > = {

  story:
    "stories",

  person:
    "people",

  place:
    "places",

  period:
    "timeline",

  book:
    "bible",

  visual:
    "visual",

};


const labelByType:
  Record<
    ContentType,
    string
  > = {

  story:
    "STORY",

  person:
    "PERSON",

  place:
    "PLACE",

  period:
    "PERIOD",

  book:
    "SCRIPTURE",

  visual:
    "VISUAL",

};


/*
 * =====================================
 * JOURNEY CONFIG
 * =====================================
 */

const journeySteps:
  JourneyStepConfig[] = [

  {
    type:
      "person",

    slug:
      "david",

    fallbackTitle:
      "다윗",
  },

  {
    type:
      "story",

    slug:
      "david-is-anointed",

    fallbackTitle:
      "다윗의 기름 부음",
  },

  {
    type:
      "story",

    slug:
      "david-and-goliath",

    fallbackTitle:
      "다윗과 골리앗",
  },

  {
    type:
      "place",

    slug:
      "valley-of-elah",

    fallbackTitle:
      "엘라 골짜기",
  },

  {
    type:
      "person",

    slug:
      "jonathan",

    fallbackTitle:
      "요나단",
  },

  {
    type:
      "period",

    slug:
      "rise-of-david",

    fallbackTitle:
      "사울과 다윗의 시대",
  },

  {
    type:
      "story",

    slug:
      "david-becomes-king",

    fallbackTitle:
      "다윗이 왕이 되다",
  },

  {
    type:
      "book",

    slug:
      "1-samuel",

    fallbackTitle:
      "사무엘상",
  },

];


/*
 * =====================================
 * NORMALIZER
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


/*
 * =====================================
 * FIRESTORE ENTITY
 * =====================================
 */

const getEntity =
  cache(
    async (
      type: ContentType,
      slugValue: string
    ): Promise<
      JourneyEntity | null
    > => {

      const slug =
        slugValue
          .trim()
          .toLowerCase();


      if (!slug) {
        return null;
      }


      const documentId =
        `${type}__${slug}`;


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
       * Journey에는 공개 콘텐츠만 노출
       */

      if (
        data.type !== type ||
        data.status !==
          "published"
      ) {
        return null;
      }


      return {

        id:
          snapshot.id,

        type,

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

        heroImage:
          normalizeString(
            data.heroImage
          ),

      };
    }
  );


/*
 * =====================================
 * PAGE
 * =====================================
 */

export default async function JourneysPage() {

  /*
   * Journey Route에 필요한
   * 8개 Entity를 Firestore에서 읽음
   */

  const resolved =
    await Promise.all(

      journeySteps.map(
        async (
          config
        ) => {

          const entity =
            await getEntity(
              config.type,
              config.slug
            );


          return {
            config,
            entity,
          };

        }
      )

    );


  /*
   * 공개 상태인 콘텐츠만
   * 실제 Journey Step으로 사용
   */

  const availableSteps =
    resolved.filter(
      (
        item
      ) =>
        item.entity !== null
    );


  /*
   * Hero는 David 데이터를 우선 사용
   */

  const david =
    resolved.find(
      (
        item
      ) =>
        item.config.type ===
          "person" &&
        item.config.slug ===
          "david"
    )?.entity;


  const heroImage =
    david?.heroImage ||
    "/assets/scraptura-david.jpg";


  /*
   * Scripture Return
   */

  const samuel =
    resolved.find(
      (
        item
      ) =>
        item.config.type ===
          "book" &&
        item.config.slug ===
          "1-samuel"
    )?.entity;


  return (

    <main>

      {/* =================================
          PAGE HEADER
      ================================= */}

      <section
        className="pageHead"
      >

        <small>
          SCRAPTURA JOURNEYS
        </small>

        <h1>
          JOURNEYS
        </h1>

        <p>
          하나의 질문에서 시작해 성경의 인물,
          이야기, 장소와 본문을 연결하며
          탐험하세요.
        </p>

      </section>


      {/* =================================
          INTRO
      ================================= */}

      <section
        className="journeysIntro"
      >

        <small>
          BEGIN A JOURNEY
        </small>

        <h2>
          읽는 순서가 아니라,
          발견하는 흐름을 따라갑니다
        </h2>

        <p>
          JOURNEYS는 SCRAPTURA의 콘텐츠를
          주제별 탐험 경로로 연결합니다.
          각 단계는 다른 기록으로 이어지며
          마지막에는 다시 성경 본문으로
          돌아옵니다.
        </p>

      </section>


      {/* =================================
          FEATURED JOURNEY
      ================================= */}

      <section
        className="journeyFeature"
      >

        <div
          className="journeyFeatureHero"
          style={{
            backgroundImage:
              `url("${heroImage}")`,
          }}
        >

          <div
            className="journeyFeatureShade"
          />


          <div
            className="journeyFeatureCopy"
          >

            <small>
              FEATURED JOURNEY
            </small>

            <span>
              01
            </span>

            <h2>
              다윗의 부르심에서 왕국까지
            </h2>

            <b>
              THE RISE OF DAVID
            </b>

            <p>
              베들레헴의 목동에서 이스라엘의
              왕이 되기까지, 다윗의 여정을
              이야기·인물·장소·시대를 연결하며
              따라갑니다.
            </p>

            <a
              href="#journey-route"
            >
              START JOURNEY ↓
            </a>

          </div>

        </div>


        {/* =================================
            JOURNEY ROUTE
        ================================= */}

        <div
          className="journeyRoute"
          id="journey-route"
        >

          <div
            className="journeyRouteHead"
          >

            <small>
              EXPLORATION ROUTE
            </small>

            <h3>
              탐험 경로
            </h3>

            <p>
              각 단계를 선택하면 해당
              기록으로 이동합니다.
            </p>

          </div>


          <div
            className="journeySteps"
          >

            {availableSteps.map(
              (
                item,
                index
              ) => {

                const entity =
                  item.entity!;


                const href =
                  `/${
                    routeByType[
                      entity.type
                    ]
                  }/${entity.slug}`;


                return (

                  <Link
                    className="journeyStep"
                    href={
                      href
                    }
                    key={
                      entity.id
                    }
                  >

                    <span>
                      {
                        String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )
                      }
                    </span>


                    <div>

                      <small>
                        {
                          labelByType[
                            entity.type
                          ]
                        }
                      </small>

                      <h4>
                        {
                          entity.titleKo ||
                          item
                            .config
                            .fallbackTitle
                        }
                      </h4>

                    </div>


                    <b>
                      →
                    </b>

                  </Link>

                );

              }
            )}

          </div>


          {/* =================================
              RETURN TO SCRIPTURE
          ================================= */}

          <div
            className="journeyReturn"
          >

            <small>
              RETURN TO SCRIPTURE
            </small>

            <p>
              탐험의 마지막은 사무엘상
              본문으로 돌아갑니다.
              시각적·역사적 맥락은 본문을
              대체하는 것이 아니라 다시 읽기
              위한 안내입니다.
            </p>


            {samuel ? (

              <Link
                href={
                  `/bible/${samuel.slug}`
                }
              >
                READ {
                  samuel.titleEn ||
                  "1 SAMUEL"
                } →
              </Link>

            ) : (

              <Link
                href="/bible/1-samuel"
              >
                READ 1 SAMUEL →
              </Link>

            )}

          </div>

        </div>

      </section>

    </main>

  );
}