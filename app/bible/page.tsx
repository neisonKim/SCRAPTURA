import type {
  Metadata,
} from "next";

import BibleArchiveFirebase from
  "../../components/BibleArchiveFirebase";


export const metadata:
  Metadata = {

  title: "Bible",

  description:
    "성경의 각 책을 중심으로 주요 인물, 장소, 시대와 이야기를 연결하며 본문의 흐름을 탐험합니다.",

  openGraph: {
    title:
      "Bible | SCRAPTURA",

    description:
      "성경책을 중심으로 주요 인물, 장소, 시대와 이야기를 연결하며 성경 본문을 탐험합니다.",

    url:
      "/bible",
  },
};


export default function Page() {
  return (
    <BibleArchiveFirebase />
  );
}