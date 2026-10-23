import Link from "next/link";
import { timelinePeriods, visualEntries } from "../data/exploration";

export default function ExplorationPager({ type, slug }: { type: "period" | "visual"; slug: string }) {
  const list = type === "period" ? timelinePeriods : visualEntries;
  const index = list.findIndex(item => item.slug === slug);
  if (index < 0) return null;
  const prefix = type === "period" ? "/timeline" : "/visual";
  return (
    <nav className="explorationPager" aria-label={type === "period" ? "시대 이어서 탐험하기" : "장면 이어서 탐험하기"}>
      {index > 0 && <Link href={`${prefix}/${list[index - 1].slug}`}><small>← 이전 {type === "period" ? "시대" : "장면"}</small><span>{list[index - 1].titleKo}</span></Link>}
      <Link href={prefix}><small>ARCHIVE</small><span>전체 {type === "period" ? "시대" : "장면"} 보기</span></Link>
      {index < list.length - 1 && <Link href={`${prefix}/${list[index + 1].slug}`}><small>다음 {type === "period" ? "시대" : "장면"} →</small><span>{list[index + 1].titleKo}</span></Link>}
    </nav>
  );
}
