"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { mergeArchiveRecords } from "../lib/archive-merge";
import { visualCollections, type VisualCollection } from "../data/exploration-collections";

type VisualRecord = {
  id: string; slug: string; titleKo: string; titleEn: string; eyebrow: string;
  summary: string; heroImage: string; order: number; collection?: VisualCollection;
};
const text = (value: unknown) => typeof value === "string" ? value : "";

export default function VisualArchiveFirebase({ title, subtitle, initialRecords }: {
  title: string; subtitle: string; initialRecords: VisualRecord[];
}) {
  const [visuals, setVisuals] = useState(initialRecords);
  const [selected, setSelected] = useState<"all" | VisualCollection>("all");

  useEffect(() => {
    let active = true;
    async function loadVisuals() {
      try {
        const snapshot = await getDocs(query(collection(db, "contents"), where("status", "==", "published")));
        const records: VisualRecord[] = snapshot.docs.flatMap(document => {
          const data = document.data();
          const slug = text(data.slug).trim().toLowerCase();
          if (data.type !== "visual" || !slug) return [];
          const category = visualCollections.find(item => item.id === data.collection)?.id;
          return [{ id: document.id, slug, titleKo: text(data.titleKo), titleEn: text(data.titleEn),
            eyebrow: text(data.eyebrow), summary: text(data.summary), heroImage: text(data.heroImage),
            order: typeof data.order === "number" ? data.order : 9999,
            ...(category ? { collection: category } : {}),
          }];
        });
        if (active) setVisuals(mergeArchiveRecords(initialRecords, records));
      } catch (error) {
        console.error("[VisualArchiveFirebase]", error);
      }
    }
    void loadVisuals();
    return () => { active = false; };
  }, [initialRecords]);

  const filtered = selected === "all" ? visuals : visuals.filter(visual => visual.collection === selected);
  return (
    <main>
      <section className="pageHead"><small>VISUAL SCRIPTURE ARCHIVE</small><h1>{title}</h1><p>{subtitle}</p></section>
      <section className="visualArchive">
        <div className="visualArchiveHead">
          <small>LOOK CLOSER · READ DEEPER</small>
          <h2>한 장면에서 시작하는 성경 탐험</h2>
          <p>장면을 자세히 보고, 감상 포인트를 따라 읽고, 관련 본문으로 돌아가세요. 이미지는 성경 기록을 바탕으로 한 시각적 재구성입니다.</p>
        </div>
        <div className="explorationTabs" role="group" aria-label="Visual 주제 선택">
          <button type="button" aria-pressed={selected === "all"} onClick={() => setSelected("all")}>전체 <span>{visuals.length}</span></button>
          {visualCollections.map(item => (
            <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
              {item.label} <span>{visuals.filter(visual => visual.collection === item.id).length}</span>
            </button>
          ))}
        </div>
        <p className="explorationResult" aria-live="polite">{filtered.length}개의 장면</p>
        <div className="visualMasonry">
          {filtered.map((visual, index) => (
            <Link className={`visualArchiveCard visualArchiveCard${(index % 3) + 1}`} key={visual.slug} href={`/visual/${visual.slug}`}>
              <div className="visualArchiveImage" style={{ backgroundImage: `url("${visual.heroImage}")` }}>
                <div className="visualArchiveShade" />
                <div className="visualArchiveCopy"><small>{visual.eyebrow}</small><h2>{visual.titleKo}</h2><b>{visual.titleEn}</b><p>{visual.summary}</p><span>장면과 본문 살펴보기 →</span></div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p>이 주제의 장면을 준비하고 있습니다. 다른 주제를 선택해 보세요.</p>}
      </section>
    </main>
  );
}
