import type { Metadata } from "next";
import ArchiveList from "../../components/ArchiveList";

export const metadata: Metadata = {
  title: "Timeline",

  description:
    "성경의 주요 시대와 역사적 흐름을 따라 인물, 장소, 사건과 성경 본문이 어떻게 연결되는지 탐험합니다.",

  openGraph: {
    title: "Timeline | SCRAPTURA",

    description:
      "성경의 시대적 흐름을 따라 주요 인물, 장소, 사건과 성경 기록의 관계를 탐험합니다.",

    url: "/timeline",
  },
};

export default function Page() {
  return (
    <ArchiveList
      type="period"
      title="TIMELINE"
      subtitle="성경의 시대적 흐름을 따라 인물, 장소, 사건과 성경 기록의 연결을 탐험하세요."
    />
  );
}