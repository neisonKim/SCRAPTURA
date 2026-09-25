import type {
  Metadata,
} from "next";

import VisualArchiveFirebase
  from "../../components/VisualArchiveFirebase";


export const metadata: Metadata = {

  title:
    "Visual",

  description:
    "성경의 이야기, 인물과 장소를 이미지와 장면으로 탐험하는 SCRAPTURA Visual Scripture Archive입니다.",

  openGraph: {

    title:
      "Visual | SCRAPTURA",

    description:
      "성경의 이야기, 인물과 장소를 시각적 기록과 장면으로 탐험하는 Visual Scripture Archive입니다.",

    url:
      "/visual",

  },

};


export default function Page() {

  return (

    <VisualArchiveFirebase

      title="VISUAL"

      subtitle="성경 세계를 시각적으로 탐험하는 아카이브입니다."

    />

  );

}