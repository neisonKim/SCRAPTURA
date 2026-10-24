import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journeys, type Journey } from "../../data/journeys";
import "./journeys.css";

export const metadata: Metadata = {
  title: "Journeys | SCRAPTURA",
  description: "창조에서 새 예루살렘까지, 16개 여정으로 성경 66권과 인물·장소·이야기·Timeline·Visual을 연결해 탐험하세요.",
};

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Link href={`/journeys/${journey.slug}`} className="journeysCard">
      <div className="journeysCardImage"><Image src={journey.image} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 600px" loading="lazy" /></div>
      <div className="journeysCardShade" />
      <div className="journeysCardContent">
        <div className="journeysCardTop"><small>{journey.label}</small><span>{journey.number}</span></div>
        <div className="journeysCardBottom">
          <h3>{journey.titleEn}</h3><h4>{journey.titleKo}</h4><p>{journey.description}</p>
          <div className="journeysCardFooter"><span>{journey.steps.length} RECORDS</span><b>EXPLORE →</b></div>
        </div>
      </div>
    </Link>
  );
}

export default function JourneysPage() {
  const featured = journeys[0];
  const groups = [
    { id: "old-testament", eyebrow: "OLD TESTAMENT", title: "약속에서 귀환까지", description: "족장과 광야, 왕국과 예언, 포로와 귀환의 흐름을 따라갑니다.", items: journeys.slice(1, 9) },
    { id: "new-testament", eyebrow: "NEW TESTAMENT", title: "복음에서 모든 민족으로", description: "예수님의 삶과 부활, 교회의 시작과 선교를 연결합니다.", items: journeys.slice(9, 13) },
    { id: "thematic-journeys", eyebrow: "THEMATIC JOURNEYS", title: "삶과 공동체, 회복의 소망", description: "기도와 지혜, 교회에 보낸 편지, 새 창조의 약속을 깊이 읽습니다.", items: journeys.slice(13) },
  ];
  return (
    <main className="journeysRefreshed">
      <section className="pageHead"><small>SCRAPTURA · {journeys.length} CONNECTED JOURNEYS</small><h1>JOURNEYS</h1><p>창조에서 새 예루살렘까지.<br />새로운 장면과 인물, 장소를 따라 성경 66권의 세계를 탐험하세요.</p></section>
      <section className="journeysArchiveIntro">
        <small>CHOOSE YOUR NEXT CHAPTER</small><h2>하나의 장면에서 더 넓은 성경의 세계로</h2>
        <p>13개 시대의 흐름과 3개 주제별 여정을 준비했습니다. 각 경로에서 이야기와 인물, 장소와 Visual을 만난 뒤 연결된 성경 본문으로 돌아갑니다.</p>
        <nav className="journeyArchiveNav" aria-label="여정 분류">{groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.eyebrow} ↓</a>)}</nav>
      </section>
      <section className="journeysFeatured">
        <div className="journeysSectionHead"><small>START AT THE BEGINNING</small><span>{featured.number}</span></div>
        <Link href={`/journeys/${featured.slug}`} className="journeysFeaturedCard">
          <div className="journeysFeaturedImage"><Image src={featured.image} alt="" fill sizes="100vw" priority /></div>
          <div className="journeysFeaturedShade" />
          <div className="journeysFeaturedContent">
            <small>{featured.label}</small><strong>{featured.number}</strong><h2>{featured.titleEn}</h2><h3>{featured.titleKo}</h3><p>{featured.description}</p>
            <div className="journeysFeaturedMeta"><span>{featured.steps.length} RECORDS</span><b>START JOURNEY →</b></div>
          </div>
        </Link>
      </section>
      {groups.map(group => (
        <section key={group.id} id={group.id} className="journeysMore">
          <div className="journeysMoreHead"><small>{group.eyebrow}</small><h2>{group.title}</h2><p>{group.description}</p></div>
          <div className="journeysGrid">{group.items.map(journey => <JourneyCard key={journey.slug} journey={journey} />)}</div>
        </section>
      ))}
    </main>
  );
}
