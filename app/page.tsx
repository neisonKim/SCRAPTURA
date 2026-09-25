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

      <section className="homeHero">

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

          <Link href="/journeys">
            BEGIN YOUR JOURNEY
          </Link>

        </div>

      </section>


      {/* =====================================================
          EXPLORE PORTAL
          ===================================================== */}

      <section className="portal">

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

    </main>
  );
}