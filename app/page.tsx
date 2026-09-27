import Link from "next/link";


const cards = [
  [
    "/stories",
    "STORIES",
    "성경의 이야기를 장면으로",
  ],

  [
    "/people",
    "PEOPLE",
    "인물의 여정을 따라",
  ],

  [
    "/places",
    "PLACES",
    "성경의 장소를 탐험",
  ],

  [
    "/timeline",
    "TIMELINE",
    "시간의 흐름을 따라",
  ],

  [
    "/bible",
    "BIBLE",
    "다시 본문으로",
  ],

  [
    "/visual",
    "VISUAL",
    "시각으로 만나는 세계",
  ],
] as const;


export default function Home() {

  return (
    <main className="home">


      {/* =====================================================
          HERO
          ===================================================== */}

      <section
          className="homeHero"
          id="home-top"
        >

        <div className="heroShade" />


        <div className="homeCopy">

          <small>
            INTERACTIVE BIBLICAL ARCHIVE
          </small>


          <h1>
            SCRAPTURA
          </h1>


          <h2>
            Explore the World of Scripture
          </h2>


          <p>
            성경을 읽는 것을 넘어,
            그 세계를 탐험하다.
          </p>


      <Link href="#explore-portal">
        BEGIN YOUR JOURNEY
      </Link>

        </div>

      </section>


      {/* =====================================================
          EXPLORE PORTAL
          ===================================================== */}

      <section
        className="portal"
        id="explore-portal"
      >

        <div className="sectionTitle">

          <small>
            DISCOVER
          </small>


          <h2>
            What would you like to explore?
          </h2>

        </div>


        <div className="portalGrid">

          {cards.map(
            ([
              href,
              title,
              description,
            ]) => (

              <Link
                href={href}
                key={href}
              >

                <small>
                  EXPLORE
                </small>


                <h3>
                  {title}
                </h3>


                <p>
                  {description}
                </p>


                <b>
                  ENTER →
                </b>

              </Link>

            )
          )}

        </div>

      </section>

      {/* =====================================================
          FEATURED JOURNEY
          ===================================================== */}
      {/* =====================================================
          BIBLICAL WORLD JOURNEY
          ===================================================== */}

      <section className="featuredJourney">

        <div
          className="featuredJourneyBackground"
          aria-hidden="true"
        />


        <div
          className="featuredJourneyShade"
          aria-hidden="true"
        />


        <div className="featuredJourneyInner">

          <div className="featuredJourneyMeta">

            <small>
              EXPLORE THE WORLD
            </small>
          </div>


          <div className="featuredJourneyCopy">

            <small>
              INTERACTIVE BIBLICAL ARCHIVE
            </small>


            <h2>
              ONE STORY.
              <br />
              A WORLD
              <br />
              TO EXPLORE.
            </h2>


            <h3>
              하나의 이야기,
              <br />
              끝없이 이어지는 성경의 세계
            </h3>


            <div className="homeJourneyLinkWrap">

            <Link
              href="/journeys"
              className="homeJourneyLink"
            >
              EXPLORE JOURNEYS
              <span>→</span>
            </Link>

          </div>


            <p>
              창조에서 왕국으로,
              예언자에서 복음으로.
              인물과 장소, 시대와 사건을 따라
              성경의 세계를 하나의 연결된 이야기로 탐험합니다.
            </p>


            <div className="featuredJourneyTypes">

              <span>
                STORY
              </span>

              <i>
                ·
              </i>

              <span>
                PEOPLE
              </span>

              <i>
                ·
              </i>

              <span>
                PLACE
              </span>

              <i>
                ·
              </i>

              <span>
                PERIOD
              </span>

              <i>
                ·
              </i>

              <span>
                BIBLE
              </span>

              <i>
                ·
              </i>

              <span>
                VISUAL
              </span>

            </div>


            <div className="featuredJourneyFooter">


            </div>

          </div>

        </div>

      </section>


    </main>
  );
}