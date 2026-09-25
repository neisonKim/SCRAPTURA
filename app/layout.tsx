import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "SCRAPTURA — Explore the World of Scripture",
    template: "%s | SCRAPTURA",
  },

  description:
    "성경의 이야기, 인물, 장소, 시대와 본문을 서로 연결하며 탐험하는 인터랙티브 Biblical Archive.",

  applicationName: "SCRAPTURA",

  keywords: [
    "SCRAPTURA",
    "성경",
    "성경 아카이브",
    "성경 이야기",
    "성경 인물",
    "성경 장소",
    "성경 역사",
    "Biblical Archive",
    "Bible",
    "Scripture",
  ],

  openGraph: {
    type: "website",
    locale: "ko_KR",

    siteName: "SCRAPTURA",

    title:
      "SCRAPTURA — Explore the World of Scripture",

    description:
      "성경의 이야기, 인물, 장소, 시대와 본문을 서로 연결하며 탐험하는 인터랙티브 Biblical Archive.",

    url: "/",
  },

  twitter: {
    card: "summary",

    title:
      "SCRAPTURA — Explore the World of Scripture",

    description:
      "성경의 이야기, 인물, 장소, 시대와 본문을 서로 연결하며 탐험하는 인터랙티브 Biblical Archive.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}