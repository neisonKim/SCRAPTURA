import type {
  Metadata,
} from "next";

import PeopleArchiveFirebase
  from "../../components/PeopleArchiveFirebase";


export const metadata: Metadata = {
  title:
    "People",

  description:
    "다윗, 사울, 요나단 등 성경 속 인물의 삶과 관계를 이야기, 장소, 시대와 성경 본문으로 연결해 탐험합니다.",

  openGraph: {
    title:
      "People | SCRAPTURA",

    description:
      "성경 속 인물의 삶과 관계를 따라 이야기, 장소, 시대와 성경 본문을 탐험합니다.",

    url:
      "/people",
  },
};


export default function Page() {
  return (
    <PeopleArchiveFirebase />
  );
}