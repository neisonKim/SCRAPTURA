import type { Metadata } from "next";
import PlacesArchiveFirebase
  from "../../components/PlacesArchiveFirebase";

export const metadata: Metadata = {
  title: "Places",

  description:
    "예루살렘, 베들레헴, 엘라 골짜기 등 성경 속 장소를 관련 인물, 이야기, 시대와 성경 본문으로 연결해 탐험합니다.",

  openGraph: {
    title: "Places | SCRAPTURA",

    description:
      "성경의 사건이 펼쳐진 장소를 중심으로 인물, 이야기, 시대와 성경 본문을 연결해 탐험합니다.",

    url: "/places",
  },
};

export default function Page() {
return (
  <PlacesArchiveFirebase />
);
}