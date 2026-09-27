import Link
  from "next/link";

import {
  journeys,
} from "../../data/journeys";


export default function JourneysPage() {

  const featuredJourney =
    journeys[0];


  const otherJourneys =
    journeys.slice(1);


  return (
    <main>


      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <section className="pageHead">

        <small>
          SCRAPTURA JOURNEYS
        </small>


        <h1>
          JOURNEYS
        </h1>


        <p>
          성경의 인물과 이야기,
          장소와 시대를 하나의 흐름으로
          연결하며 탐험하세요.
        </p>

      </section>


      {/* =====================================================
          INTRO
          ===================================================== */}

      <section className="journeysArchiveIntro">

        <small>
          FOLLOW THE CONNECTIONS
        </small>


        <h2>
          하나의 기록에서 다음 이야기로
        </h2>


        <p>
          JOURNEYS는 성경을 정해진 순서대로
          읽는 기능이 아닙니다.
          한 인물과 사건에서 시작해
          관련된 장소와 시대,
          다시 성경 본문까지 연결되는
          탐험 경로입니다.
        </p>

      </section>


      {/* =====================================================
          FEATURED JOURNEY
          ===================================================== */}

      {featuredJourney && (

        <section className="journeysFeatured">

          <div className="journeysSectionHead">

            <small>
              FEATURED JOURNEY
            </small>


            <span>
              {featuredJourney.number}
            </span>

          </div>


          <Link
            href={
              `/journeys/${featuredJourney.slug}`
            }
            className="journeysFeaturedCard"
          >

            <div
              className="journeysFeaturedImage"
              style={{
                backgroundImage:
                  `url("${featuredJourney.image}")`,
              }}
            />


            <div
              className="journeysFeaturedShade"
            />


            <div className="journeysFeaturedContent">

              <small>
                {featuredJourney.label}
              </small>


              <strong>
                {featuredJourney.number}
              </strong>


              <h2>
                {featuredJourney.titleEn}
              </h2>


              <h3>
                {featuredJourney.titleKo}
              </h3>


              <p>
                {featuredJourney.description}
              </p>


              <div className="journeysFeaturedMeta">

                <span>
                  {String(
                    featuredJourney.steps.length
                  ).padStart(
                    2,
                    "0"
                  )}
                  {" "}
                  RECORDS
                </span>


                <b>
                  START JOURNEY →
                </b>

              </div>

            </div>

          </Link>

        </section>

      )}


      {/* =====================================================
          MORE JOURNEYS
          ===================================================== */}

      {otherJourneys.length > 0 && (

        <section className="journeysMore">

          <div className="journeysMoreHead">

            <small>
              EXPLORE MORE
            </small>


            <h2>
              더 많은 여정
            </h2>


            <p>
              인물의 삶,
              역사적 변화,
              장소와 성경의 흐름을
              서로 다른 관점에서 탐험하세요.
            </p>

          </div>


          <div
            className={
              otherJourneys.length === 1
                ? "journeysGrid journeysGridSingle"
                : "journeysGrid"
            }
          >

            {otherJourneys.map(
              (journey) => (

                <Link
                  href={
                    `/journeys/${journey.slug}`
                  }
                  className="journeysCard"
                  key={journey.slug}
                >

                  <div
                    className="journeysCardImage"
                    style={{
                      backgroundImage:
                        `url("${journey.image}")`,
                    }}
                  />


                  <div
                    className="journeysCardShade"
                  />


                  <div className="journeysCardContent">

                    <div className="journeysCardTop">

                      <small>
                        {journey.label}
                      </small>


                      <span>
                        {journey.number}
                      </span>

                    </div>


                    <div className="journeysCardBottom">

                      <h3>
                        {journey.titleEn}
                      </h3>


                      <h4>
                        {journey.titleKo}
                      </h4>


                      <p>
                        {journey.description}
                      </p>


                      <div className="journeysCardFooter">

                        <span>
                          {String(
                            journey.steps.length
                          ).padStart(
                            2,
                            "0"
                          )}
                          {" "}
                          RECORDS
                        </span>


                        <b>
                          EXPLORE →
                        </b>

                      </div>

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

        </section>

      )}


    </main>
  );
}