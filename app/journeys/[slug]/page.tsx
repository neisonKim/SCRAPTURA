import type {
  Metadata,
} from "next";

import Link
  from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  getJourney,
  journeys,
} from "../../../data/journeys";


type JourneyPageProps = {

  params:
    Promise<{
      slug: string;
    }>;

};


/* =====================================================
   SITE URL
   ===================================================== */

const SITE_URL =
  (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(
    /\/$/,
    ""
  );


/* =====================================================
   STATIC PARAMS
   ===================================================== */

export function generateStaticParams() {

  return journeys.map(
    (journey) => ({
      slug:
        journey.slug,
    })
  );

}


/* =====================================================
   METADATA
   ===================================================== */

export async function generateMetadata({
  params,
}: JourneyPageProps):
  Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  const journey =
    getJourney(
      slug
    );


  if (!journey) {

    return {
      title: {
        absolute:
          "Journeys | SCRAPTURA",
      },

      robots: {
        index:
          false,

        follow:
          false,
      },
    };

  }


  const canonicalUrl =
    `${SITE_URL}/journeys/${encodeURIComponent(
      journey.slug
    )}`;


  const imageUrl =
    journey.image.startsWith(
      "http"
    )
      ? journey.image
      : `${SITE_URL}${
          journey.image.startsWith("/")
            ? ""
            : "/"
        }${journey.image}`;


  const title =
    `${journey.titleEn} | SCRAPTURA`;


  return {

    title: {
      absolute:
        title,
    },


    description:
      journey.description,


    alternates: {

      canonical:
        canonicalUrl,

    },


    openGraph: {

      type:
        "article",

      siteName:
        "SCRAPTURA",

      title,

      description:
        journey.description,

      url:
        canonicalUrl,

      images: [
        {
          url:
            imageUrl,

          alt:
            journey.titleKo,
        },
      ],

    },


    twitter: {

      card:
        "summary_large_image",

      title,

      description:
        journey.description,

      images: [
        imageUrl,
      ],

    },

  };

}


/* =====================================================
   PAGE
   ===================================================== */

export default async function JourneyDetailPage({
  params,
}: JourneyPageProps) {

  const {
    slug,
  } =
    await params;


  const journey =
    getJourney(
      slug
    );


  if (!journey) {

    notFound();

  }


  return (
    <main>


      {/* ===================================================
          HEADER
          =================================================== */}

      <section className="pageHead">

        <small>
          SCRAPTURA JOURNEY · {journey.number}
        </small>


        <h1>
          JOURNEY
        </h1>


        <p>
          하나의 인물에서 시작해
          이야기와 장소,
          시대와 성경 본문까지
          연결해서 탐험합니다.
        </p>

      </section>


      {/* ===================================================
          JOURNEY
          =================================================== */}

      <section className="journeyFeature">

        <Link
          href="/journeys"
          className="journeyDetailBack"
        >
          ← ALL JOURNEYS
        </Link>


        <div
          className="journeyFeatureHero"
          style={{
            backgroundImage:
              `url("${journey.image}")`,
          }}
        >

          <div
            className="journeyFeatureShade"
          />


          <div className="journeyFeatureCopy">

            <small>
              {journey.label}
            </small>


            <span>
              {journey.number}
            </span>


            <h2>
              {journey.titleKo}
            </h2>


            <b>
              {journey.titleEn}
            </b>


            <p>
              {journey.description}
            </p>


            <a href="#journey-route">
              BEGIN EXPLORATION ↓
            </a>

          </div>

        </div>


        {/* =================================================
            EXPLORATION ROUTE
            ================================================= */}

        <div
          className="journeyRoute"
          id="journey-route"
        >

          <div className="journeyRouteHead">

            <small>
              EXPLORATION ROUTE
            </small>


            <h3>
              탐험 경로
            </h3>


            <p>
              각 단계를 선택하면
              해당 기록으로 이동합니다.
            </p>

          </div>


          <div className="journeySteps">

            {journey.steps.map(
              (
                step,
                index
              ) => (

                <Link
                  className="journeyStep"
                  href={step.href}
                  key={
                    `${step.href}-${index}`
                  }
                >

                  <span>
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>


                  <div>

                    <small>
                      {step.label}
                    </small>


                    <h4>
                      {step.title}
                    </h4>

                  </div>


                  <b>
                    →
                  </b>

                </Link>

              )
            )}

          </div>


          {/* =================================================
              RETURN TO SCRIPTURE
              ================================================= */}

          <div className="journeyReturn">

            <small>
              RETURN TO SCRIPTURE
            </small>


            <p>
              탐험의 마지막은
              사무엘상 본문으로 돌아갑니다.
              시각적·역사적 맥락은
              본문을 대체하는 것이 아니라
              다시 읽기 위한 안내입니다.
            </p>


            <Link
              href={
                journey.returnHref
              }
            >
              {journey.returnLabel} →
            </Link>

          </div>

        </div>

      </section>


    </main>
  );
}