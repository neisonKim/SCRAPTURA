import type { Metadata } from "next";
import StoriesArchiveFirebase
  from "../../components/StoriesArchiveFirebase";
import { getLocalArchiveRecords } from "../../data/archive";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "성경의 주요 이야기와 사건을 인물, 장소, 시대와 성경 본문으로 연결해 탐험합니다.",
};

export default function Page() {
  return (
<StoriesArchiveFirebase
  title="STORIES"
  subtitle="성경의 이야기와 주제별 본문을 따라 인물과 장소, 각 책의 흐름을 탐험하세요."
  initialRecords={getLocalArchiveRecords("story")}
/>
  );
}
