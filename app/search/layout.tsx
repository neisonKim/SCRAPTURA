import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",

  description:
    "SCRAPTURA의 성경 이야기, 인물, 장소, 시대와 성경 기록을 통합 검색합니다.",

  robots: {
    index: false,
    follow: true,

    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}