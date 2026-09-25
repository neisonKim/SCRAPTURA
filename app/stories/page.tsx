import type { Metadata } from "next";
import StoriesArchiveFirebase
  from "../../components/StoriesArchiveFirebase";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "성경의 주요 이야기와 사건을 인물, 장소, 시대와 성경 본문으로 연결해 탐험합니다.",
};

export default function Page() {
  return (
<StoriesArchiveFirebase
  title="STORIES"
  subtitle="현재 사용 중인 문구"
/>
  );
}