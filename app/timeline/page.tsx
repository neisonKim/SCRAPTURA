import type { Metadata } from "next";
import Link from "next/link";
import Hero from "../../components/Hero";
import { timelinePeriods } from "../../data/exploration";

export const metadata: Metadata = {
  title: "Timeline",
  description: "창조에서 초대교회까지, 13개 시대와 주요 전환점을 따라 성경의 이야기와 인물, 장소를 연결합니다.",
  openGraph: { title: "Timeline | SCRAPTURA", url: "/timeline", images: [{ url: "/assets/editorial/timeline-world-v2.webp", alt: "성경의 시간을 따라 이어지는 길" }] },
};

export default function TimelinePage() {
  return (
    <main className="timelinePage">
      <Hero eyebrow="BIBLICAL TIMELINE · 13 PERIODS" titleKo="TIMELINE" titleEn="성경의 시간을 따라" summary="창조에서 초대교회까지. 시대의 전환점을 따라 인물과 장소, 이야기와 본문을 하나의 흐름으로 연결하세요." image="/assets/editorial/timeline-world-v2.webp" />
      <section className="timelineArchive">
        <div className="timelineSectionHead">
          <small>ONE STORY THROUGH GENERATIONS</small>
          <h2>시대를 건너 이어지는 이야기</h2>
          <p>연대가 논의되는 구간은 특정 연도보다 성경 본문의 사건 순서를 따릅니다. 각 시대에서 주요 장면과 관련 본문으로 탐험을 이어가세요.</p>
        </div>
        <nav className="explorationTabs timelineChapters" aria-label="시대 구간 바로 가기">
          <a href="#period-creation-and-beginnings">01–04 · 시작과 정착</a>
          <a href="#period-rise-of-david">05–09 · 왕국과 귀환</a>
          <a href="#period-life-of-jesus">10–13 · 복음과 교회</a>
        </nav>
        <div className="timelineTrack">
          {timelinePeriods.map(period => (
            <Link className="timelineEntry" id={`period-${period.slug}`} key={period.slug} href={`/timeline/${period.slug}`}>
              <div className="timelineMarker"><span>{String(period.order).padStart(2, "0")}</span></div>
              <div className="timelineEntryImage" style={{ backgroundImage: `url("${period.heroImage}")` }} />
              <div className="timelineEntryContent">
                <small>{period.testament === "old" ? "OLD TESTAMENT" : "NEW TESTAMENT"} · {period.readingLabel}</small>
                <h2>{period.titleKo}</h2><b>{period.titleEn}</b><p>{period.summary}</p>
                <span>시대의 흐름 살펴보기 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
