import Link from "next/link";
import { nodes, ContentType } from "../data/content";

const plural: Record<string, string> = {
  story: "stories", person: "people", place: "places",
  period: "timeline", book: "bible", visual: "visual",
};

function Cards({ list, type }: { list: typeof nodes; type: ContentType }) {
  return (
    <div className="cardGrid">
      {list.map((n) => (
        <Link className="archiveCard" key={n.slug} href={`/${plural[type]}/${n.slug}`}>
          <div className="cardImage" style={{ backgroundImage: `url("${n.heroImage}")` }} />
          <small>{n.eyebrow}</small><h2>{n.titleKo}</h2><b>{n.titleEn}</b><p>{n.summary}</p>
        </Link>
      ))}
    </div>
  );
}

export default function ArchiveList({ type, title, subtitle }: { type: ContentType; title: string; subtitle: string }) {
  const list = nodes.filter((n) => n.type === type);
  const head = <section className="pageHead"><small>SCRAPTURA ARCHIVE</small><h1>{title}</h1><p>{subtitle}</p></section>;

  if (type === "story" && list.length) {
    const featured = list[0], rest = list.slice(1);
    return <main>{head}<section className="archiveFeaturedWrap">
      <div className="archiveSectionHead"><small>FEATURED STORY</small><h2>이야기에서 성경의 세계로 들어가세요</h2><p>하나의 사건을 따라 인물, 장소, 시대와 성경 본문으로 탐험을 확장할 수 있습니다.</p></div>
      <Link className="archiveFeatured" href={`/stories/${featured.slug}`}>
        <div className="archiveFeaturedImage" style={{backgroundImage:`url("${featured.heroImage}")`}} />
        <div className="archiveFeaturedContent"><small>{featured.eyebrow}</small><h2>{featured.titleKo}</h2><b>{featured.titleEn}</b><p>{featured.summary}</p><span>EXPLORE STORY →</span></div>
      </Link></section>
      {rest.length > 0 && <section className="archiveAllStories"><div className="archiveSectionHead"><small>EXPLORE STORIES</small><h2>더 많은 이야기를 탐험하세요</h2></div><Cards list={rest} type={type}/></section>}
    </main>;
  }

  if (type === "person" && list.length) {
    const featured = list.find(n=>n.slug==="david") ?? list[0];
    const rest = list.filter(n=>n.slug!==featured.slug);
    return <main>{head}<section className="peopleFeaturedWrap">
      <div className="peopleSectionHead"><small>EXPLORE A PERSON</small><h2>인물의 여정을 따라 성경의 세계를 탐험하세요</h2><p>한 인물의 삶을 따라가며 관련 이야기, 장소, 시대와 성경 본문으로 탐험을 이어갈 수 있습니다.</p></div>
      <Link className="peopleFeatured" href={`/people/${featured.slug}`}>
        <div className="peopleFeaturedImage" style={{backgroundImage:`url("${featured.heroImage}")`}} />
        <div className="peopleFeaturedContent"><small>{featured.eyebrow}</small><h2>{featured.titleKo}</h2><b>{featured.titleEn}</b><p>{featured.summary}</p><span>EXPLORE PERSON →</span></div>
      </Link></section>
      {rest.length > 0 && <section className="peopleArchive"><div className="peopleSectionHead"><small>PEOPLE ARCHIVE</small><h2>성경 속 인물들을 만나보세요</h2><p>각 인물의 기록에서 다른 인물과 사건, 장소로 연결되는 관계를 발견할 수 있습니다.</p></div><Cards list={rest} type={type}/></section>}
    </main>;
  }

  if (type === "place" && list.length) {
    const featured = list.find(n=>n.slug==="valley-of-elah") ?? list[0];
    const rest = list.filter(n=>n.slug!==featured.slug);
    return <main>{head}<section className="placesFeaturedWrap">
      <div className="placesSectionHead"><small>EXPLORE A PLACE</small><h2>성경의 사건이 펼쳐진 공간을 탐험하세요</h2><p>장소를 중심으로 관련 인물과 사건, 시대와 성경 본문을 연결하며 성경의 공간적 배경을 살펴봅니다.</p></div>
      <Link className="placesFeatured" href={`/places/${featured.slug}`}>
        <div className="placesFeaturedImage" style={{backgroundImage:`url("${featured.heroImage}")`}}>
          <div className="placesFeaturedShade" />
          <div className="placesFeaturedContent"><small>{featured.eyebrow}</small><h2>{featured.titleKo}</h2><b>{featured.titleEn}</b><p>{featured.summary}</p><span>EXPLORE PLACE →</span></div>
        </div>
      </Link></section>
      {rest.length > 0 && <section className="placesArchive"><div className="placesSectionHead"><small>PLACES ARCHIVE</small><h2>성경 속 장소들을 계속 탐험하세요</h2><p>주요 도시와 전장의 기록을 따라 사건이 일어난 공간의 관계를 발견할 수 있습니다.</p></div><Cards list={rest} type={type}/></section>}
    </main>;
  }


  // TIMELINE
  if (type === "period" && list.length > 0) {
    return (
      <main>
        {head}
        <section className="timelineArchive">
          <div className="timelineSectionHead">
            <small>BIBLICAL TIMELINE</small>
            <h2>시대의 흐름을 따라 성경의 세계를 탐험하세요</h2>
            <p>
              각 시대를 따라 주요 인물과 장소, 사건과 성경 기록이
              어떻게 이어지는지 살펴볼 수 있습니다.
            </p>
          </div>

          <div className="timelineTrack">
            {list.map((n, index) => (
              <Link
                className="timelineEntry"
                key={n.slug}
                href={`/timeline/${n.slug}`}
              >
                <div className="timelineMarker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div
                  className="timelineEntryImage"
                  style={{ backgroundImage: `url("${n.heroImage}")` }}
                />

                <div className="timelineEntryContent">
                  <small>{n.eyebrow}</small>
                  <h2>{n.titleKo}</h2>
                  <b>{n.titleEn}</b>
                  <p>{n.summary}</p>
                  <span>EXPLORE PERIOD →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // BIBLE
  if (type === "book" && list.length > 0) {
    const featured = list.find((n) => n.slug === "1-samuel") ?? list[0];
    const rest = list.filter((n) => n.slug !== featured.slug);

    return (
      <main>
        {head}

        <section className="bibleArchive">
          <div className="bibleSectionHead">
            <small>EXPLORE SCRIPTURE</small>
            <h2>성경의 책에서 인물과 사건의 세계로 들어가세요</h2>
            <p>
              각 성경책을 중심으로 주요 인물, 장소, 시대와 이야기를
              연결하며 본문으로 다시 돌아오는 탐험을 시작합니다.
            </p>
          </div>

          <Link className="bibleFeatured" href={`/bible/${featured.slug}`}>
            <div
              className="bibleFeaturedImage"
              style={{ backgroundImage: `url("${featured.heroImage}")` }}
            >
              <div className="bibleFeaturedShade" />
            </div>

            <div className="bibleFeaturedContent">
              <small>{featured.eyebrow}</small>
              <h2>{featured.titleKo}</h2>
              <b>{featured.titleEn}</b>
              <p>{featured.summary}</p>

              <div className="biblePath">
                <span>BOOK</span>
                <i>→</i>
                <span>PEOPLE</span>
                <i>→</i>
                <span>PLACES</span>
                <i>→</i>
                <span>STORIES</span>
              </div>

              <strong>EXPLORE BOOK →</strong>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="bibleBookGrid">
              {rest.map((n) => (
                <Link className="bibleBookCard" key={n.slug} href={`/bible/${n.slug}`}>
                  <div
                    className="bibleBookImage"
                    style={{ backgroundImage: `url("${n.heroImage}")` }}
                  />
                  <div>
                    <small>{n.eyebrow}</small>
                    <h3>{n.titleKo}</h3>
                    <b>{n.titleEn}</b>
                    <p>{n.summary}</p>
                    <span>EXPLORE BOOK →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    );
  }

  // VISUAL
  if (type === "visual") {
    return (
      <main>
        {head}

        <section className="visualArchive">
          <div className="visualArchiveHead">
            <small>VISUAL SCRIPTURE</small>
            <h2>성경의 세계를 장면과 이미지로 탐험하세요</h2>
            <p>
              인물, 장소와 사건을 시각적으로 연결하되, 모든 시각 자료는
              성경 본문과 역사적 맥락으로 다시 이어지는 탐험의 입구가 됩니다.
            </p>
          </div>

          {list.length > 0 ? (
            <div className="visualMasonry">
              {list.map((n, index) => (
                <Link
                  className={`visualArchiveCard visualArchiveCard${(index % 3) + 1}`}
                  key={n.slug}
                  href={`/visual/${n.slug}`}
                >
                  <div
                    className="visualArchiveImage"
                    style={{ backgroundImage: `url("${n.heroImage}")` }}
                  >
                    <div className="visualArchiveShade" />
                    <div className="visualArchiveCopy">
                      <small>{n.eyebrow}</small>
                      <h2>{n.titleKo}</h2>
                      <b>{n.titleEn}</b>
                      <p>{n.summary}</p>
                      <span>EXPLORE VISUAL →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="visualEmptyState">
              <small>ARCHIVE IN PREPARATION</small>
              <h3>Visual Scripture Archive</h3>
              <p>
                성경 장면, 인물, 장소의 시각 자료가 이곳에 연결됩니다.
                현재는 아카이브 구조를 먼저 준비하고 있습니다.
              </p>

              <div className="visualEmptyGrid">
                <div><span>01</span><b>STORY SCENES</b><p>이야기의 핵심 장면</p></div>
                <div><span>02</span><b>PEOPLE</b><p>인물의 시각 기록</p></div>
                <div><span>03</span><b>PLACES</b><p>성경 속 공간과 지형</p></div>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return <main>{head}<Cards list={list} type={type}/></main>;
}
