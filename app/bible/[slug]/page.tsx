import type {
  Metadata,
} from "next";

import BibleDetailFirebase from
  "../../../components/BibleDetailFirebase";


type BiblePageProps = {
  params:
    Promise<{
      slug: string;
    }>;
};


/*
 * =====================================
 * METADATA
 * =====================================
 *
 * 현재 BIBLE 데이터는 Client Firestore로
 * 전환했습니다.
 *
 * 개별 Firestore SEO Metadata는 이후
 * Server Repository 단계에서 연결합니다.
 */

export async function generateMetadata({
  params,
}: BiblePageProps):
  Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  return {
    title:
      "Bible",

    description:
      "SCRAPTURA에서 성경의 책과 주요 인물, 장소, 시대와 이야기를 탐험합니다.",

    alternates: {
      canonical:
        `/bible/${slug}`,
    },

    openGraph: {
      type:
        "article",

      locale:
        "ko_KR",

      siteName:
        "SCRAPTURA",

      title:
        "Bible | SCRAPTURA",

      description:
        "SCRAPTURA에서 성경의 책과 주요 인물, 장소, 시대와 이야기를 탐험합니다.",

      url:
        `/bible/${slug}`,
    },
  };
}


/*
 * =====================================
 * PAGE
 * =====================================
 */

export default async function BibleDetailPage({
  params,
}: BiblePageProps) {

  const {
    slug,
  } =
    await params;


  return (
    <BibleDetailFirebase
      slug={
        slug
      }
    />
  );
}