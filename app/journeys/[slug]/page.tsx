import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJourney, journeys } from "../../../data/journeys";
import "../journeys.css";

type Props = { params: Promise<{ slug: string }> };
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export function generateStaticParams() { return journeys.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journey = getJourney((await params).slug);
  if (!journey) return { title: "Journeys | SCRAPTURA", robots: { index: false, follow: false } };
  const title = `${journey.titleKo} | SCRAPTURA`;
  const url = `${siteUrl}/journeys/${encodeURIComponent(journey.slug)}`;
  const image = new URL(journey.image, siteUrl).href;
  return { title: { absolute: title }, description: journey.description, alternates: { canonical: url }, openGraph: { type: "article", siteName: "SCRAPTURA", title, description: journey.description, url, images: [{ url: image, alt: journey.titleKo }] }, twitter: { card: "summary_large_image", title, description: journey.description, images: [image] } };
}
export default async function JourneyDetailPage({ params }: Props) {
  const journey = getJourney((await params).slug);
  if (!journey) notFound();
  const index = journeys.findIndex(item => item.slug === journey.slug);
  const previous = journeys[index - 1];
  const next = journeys[index + 1];
  return (
    <main className="journeysRefreshed">
      <section className="pageHead"><small>SCRAPTURA JOURNEY · {journey.number} / {journeys.length}</small><h1>JOURNEY</h1><p>{journey.readingLabel}<br />{journey.steps.length}개의 기록을 연결하는 탐험</p></section>
      <section className="journeyFeature">
        <Link href="/journeys" className="journeyDetailBack">← ALL JOURNEYS</Link>
        <div className="journeyFeatureHero" style={{ backgroundImage: `url("${journey.image}")` }}>
          <div className="journeyFeatureShade" />
          <div className="journeyFeatureCopy"><small>{journey.label}</small><span>{journey.number}</span><h2>{journey.titleKo}</h2><b>{journey.titleEn}</b><p>{journey.description}</p><a href="#journey-route">BEGIN EXPLORATION ↓</a></div>
        </div>
        <div className="journeyRoute" id="journey-route">
          <div className="journeyRouteHead"><small>EXPLORATION ROUTE · {journey.steps.length} RECORDS</small><h3>장면을 따라 이어지는 탐험 경로</h3><p>각 기록을 열어 이야기의 배경을 살펴보고, 연결된 성경 본문을 읽어 보세요.</p></div>
          <div className="journeySteps">
            {journey.steps.map((step, stepIndex) => (
              <Link className="journeyStep" href={step.href} key={step.href}>
                <span className="journeyStepNumber">{String(stepIndex + 1).padStart(2, "0")}</span>
                <div className="journeyStepImage"><Image src={step.image} alt="" fill sizes="(max-width: 700px) 88px, 150px" loading="lazy" unoptimized={!step.image.startsWith("/") || step.image.startsWith("//")} /></div>
                <div className="journeyStepCopy"><small>{step.label}</small><h4>{step.title}</h4><p>{step.description}</p>{step.scripture && <em>{step.scripture}</em>}</div><b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
          <div className="journeyReturn"><small>RETURN TO SCRIPTURE</small><h3>{journey.readingLabel}</h3><p>이 여정에서 만난 장면과 배경을 기억하며 연결된 본문을 다시 읽어 보세요.</p><Link href={journey.returnHref}>{journey.returnLabel} →</Link></div>
          <nav className="journeySiblings" aria-label="다른 여정">
            {previous && <Link href={`/journeys/${previous.slug}`}><small>← PREVIOUS JOURNEY</small><span>{previous.titleKo}</span></Link>}
            <Link href="/journeys"><small>EXPLORE ALL</small><span>모든 여정 보기</span></Link>
            {next && <Link href={`/journeys/${next.slug}`}><small>NEXT JOURNEY →</small><span>{next.titleKo}</span></Link>}
          </nav>
        </div>
      </section>
    </main>
  );
}
