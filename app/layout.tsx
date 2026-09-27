import "./globals.css";

import Header
  from "../components/Header";

import Footer
  from "../components/Footer";

import type {
  Metadata,
} from "next";


/* =====================================================
   SITE CONFIG
   ===================================================== */

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://scraptura.vercel.app"
).replace(
  /\/$/,
  ""
);


const siteDescription =
  "성경의 이야기, 인물, 장소, 시대와 본문을 서로 연결하며 탐험하는 인터랙티브 Biblical Archive.";


/*
 * 현재 프로젝트에 이미 존재하는 이미지를
 * 우선 OG 대표 이미지로 사용합니다.
 *
 * 이후 1200 × 630 전용 이미지를 만들면
 *
 * /assets/scraptura-og.jpg
 *
 * 로 교체하면 됩니다.
 */

const defaultOgImage =
  "/assets/scraptura-home-clean.jpg";


/* =====================================================
   ROOT METADATA
   ===================================================== */

export const metadata: Metadata = {

  metadataBase:
    new URL(
      siteUrl
    ),


  title: {

    default:
      "SCRAPTURA — Explore the World of Scripture",

    template:
      "%s | SCRAPTURA",

  },


  description:
    siteDescription,


  applicationName:
    "SCRAPTURA",


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


  /* ===================================================
     OPEN GRAPH
     =================================================== */

  openGraph: {

    type:
      "website",

    locale:
      "ko_KR",

    siteName:
      "SCRAPTURA",

    title:
      "SCRAPTURA — Explore the World of Scripture",

    description:
      siteDescription,

    url:
      siteUrl,


    images: [

      {

        url:
          defaultOgImage,

        width:
          1200,

        height:
          630,

        alt:
          "SCRAPTURA — Explore the World of Scripture",

      },

    ],

  },


  /* ===================================================
     TWITTER / SOCIAL CARD
     =================================================== */

  twitter: {

    card:
      "summary_large_image",

    title:
      "SCRAPTURA — Explore the World of Scripture",

    description:
      siteDescription,

    images: [
      defaultOgImage,
    ],

  },


  /* ===================================================
     ROBOTS
     =================================================== */

  robots: {

    index:
      true,

    follow:
      true,


    googleBot: {

      index:
        true,

      follow:
        true,

    },

  },

};


/* =====================================================
   ROOT LAYOUT
   ===================================================== */

export default function RootLayout({

  children,

}: Readonly<{

  children:
    React.ReactNode;

}>) {

  return (

    <html
      lang="ko"
      data-scroll-behavior="smooth"
    >

      <body>

        <Header />


        {children}


        <Footer />

      </body>

    </html>

  );

}