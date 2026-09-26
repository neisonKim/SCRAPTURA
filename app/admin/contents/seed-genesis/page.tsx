"use client";

import {
  useEffect,
  useState,
} from "react";

import Link
  from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../../../lib/firebase";


/* =====================================================
   TYPES
   ===================================================== */

type ContentType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";


type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_PERIOD"
  | "RELATED_BOOK"
  | "RELATED_STORY";


type Relation = {
  targetType:
    | "story"
    | "person"
    | "place"
    | "period"
    | "book";

  targetSlug: string;

  relationType:
    RelationType;

  label: string;
};


type StoryScene = {
  number: string;
  title: string;
  scripture: string;
  description: string;
  image: string;
};


type SeedContent = {
  type: ContentType;

  slug: string;

  titleKo: string;
  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  status:
    "draft";

  order: number;

  verificationStatus:
    "not_reviewed";

  biblicalSource: string;

  historicalSource: string;

  interpretationNote: string;

  visualReconstructionNote: string;

  relations:
    Relation[];

  overview?: string;

  scripture?:
    string[];

  scenes?:
    StoryScene[];

  bookSections?: {
    number: string;
    title: string;
    scripture: string;
    description: string;
  }[];
};


/* =====================================================
   RELATION HELPER
   ===================================================== */

function relation(
  targetType:
    Relation["targetType"],

  targetSlug:
    string,

  relationType:
    RelationType,

  label:
    string
): Relation {

  return {
    targetType,
    targetSlug,
    relationType,
    label,
  };
}


/* =====================================================
   BASE CONTENT
   ===================================================== */

function createSeed(
  content:
    Omit<
      SeedContent,
      | "heroImage"
      | "status"
      | "verificationStatus"
      | "historicalSource"
      | "interpretationNote"
      | "visualReconstructionNote"
    >
): SeedContent {

  return {
    ...content,

    heroImage:
      "",

    status:
      "draft",

    verificationStatus:
      "not_reviewed",

    historicalSource:
      "",

    interpretationNote:
      "",

    visualReconstructionNote:
      content.type ===
      "visual"
        ? "성경 본문을 기반으로 제작되는 시각적 재구성 자료입니다."
        : "",
  };
}


/* =====================================================
   GENESIS SEED
   ===================================================== */

const genesisSeed:
  SeedContent[] = [

  /* =====================================================
     BOOK — GENESIS
     ===================================================== */

  createSeed({
    type:
      "book",

    slug:
      "genesis",

    titleKo:
      "창세기",

    titleEn:
      "Genesis",

    eyebrow:
      "BIBLE · OLD TESTAMENT",

    summary:
      "창조에서 시작해 노아, 아브라함, 이삭, 야곱, 요셉으로 이어지는 성경의 시작을 기록합니다.",

    order:
      1,

    biblicalSource:
      "Genesis 1–50",

    overview:
      "창세기는 창조와 인류의 시작, 홍수와 바벨, 그리고 아브라함에서 요셉까지 이어지는 족장들의 이야기를 담고 있습니다.",

    scripture: [
      "Genesis 1–50",
    ],

    relations: [
      relation(
        "story",
        "creation",
        "RELATED_STORY",
        "창조"
      ),

      relation(
        "story",
        "noah-and-the-flood",
        "RELATED_STORY",
        "노아와 홍수"
      ),

      relation(
        "story",
        "call-of-abraham",
        "RELATED_STORY",
        "아브라함의 부르심"
      ),

      relation(
        "period",
        "primeval-history",
        "RELATED_PERIOD",
        "원역사"
      ),
    ],

    bookSections: [
      {
        number:
          "01",

        title:
          "BEGINNINGS",

        scripture:
          "Genesis 1–11",

        description:
          "창조에서 홍수와 바벨탑까지 이어지는 성경의 시작.",
      },

      {
        number:
          "02",

        title:
          "ABRAHAM",

        scripture:
          "Genesis 12–25",

        description:
          "아브라함의 부르심과 언약, 사라와 이삭의 이야기.",
      },

      {
        number:
          "03",

        title:
          "ISAAC & JACOB",

        scripture:
          "Genesis 25–36",

        description:
          "이삭과 야곱으로 이어지는 족장 가문의 이야기.",
      },

      {
        number:
          "04",

        title:
          "JOSEPH",

        scripture:
          "Genesis 37–50",

        description:
          "요셉과 그의 가족이 애굽으로 이어지는 이야기.",
      },
    ],
  }),


  /* =====================================================
     STORY — CREATION
     ===================================================== */

  createSeed({
    type:
      "story",

    slug:
      "creation",

    titleKo:
      "창조",

    titleEn:
      "Creation",

    eyebrow:
      "STORY · GENESIS 1–2",

    summary:
      "하늘과 땅의 창조와 인간의 시작을 기록하는 창세기의 첫 이야기입니다.",

    order:
      10,

    biblicalSource:
      "Genesis 1:1–2:25",

    overview:
      "창세기 1–2장은 하늘과 땅, 생명과 인간의 창조를 이야기하며 에덴의 이야기로 이어집니다.",

    scripture: [
      "Genesis 1:1–2:25",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "period",
        "primeval-history",
        "RELATED_PERIOD",
        "원역사"
      ),

      relation(
        "person",
        "adam",
        "RELATED_PERSON",
        "아담"
      ),

      relation(
        "place",
        "eden",
        "RELATED_PLACE",
        "에덴"
      ),
    ],

    scenes: [
      {
        number:
          "01",

        title:
          "IN THE BEGINNING",

        scripture:
          "Genesis 1:1–5",

        description:
          "창세기의 첫 장면은 하늘과 땅의 창조와 빛의 등장으로 시작합니다.",

        image:
          "",
      },

      {
        number:
          "02",

        title:
          "THE WORLD TAKES FORM",

        scripture:
          "Genesis 1:6–25",

        description:
          "하늘과 바다, 땅과 식물 그리고 다양한 생명이 등장합니다.",

        image:
          "",
      },

      {
        number:
          "03",

        title:
          "HUMANKIND",

        scripture:
          "Genesis 1:26–31",

        description:
          "인간의 창조가 이야기의 중심으로 들어옵니다.",

        image:
          "",
      },

      {
        number:
          "04",

        title:
          "EDEN",

        scripture:
          "Genesis 2:4–25",

        description:
          "아담과 에덴동산의 이야기가 전개됩니다.",

        image:
          "",
      },
    ],
  }),


  /* =====================================================
     STORY — NOAH
     ===================================================== */

  createSeed({
    type:
      "story",

    slug:
      "noah-and-the-flood",

    titleKo:
      "노아와 홍수",

    titleEn:
      "Noah and the Flood",

    eyebrow:
      "STORY · GENESIS 6–9",

    summary:
      "노아가 방주를 준비하고 홍수를 지나 새로운 시작을 맞는 이야기입니다.",

    order:
      20,

    biblicalSource:
      "Genesis 6–9",

    overview:
      "창세기 6–9장은 노아와 그의 가족, 방주와 홍수 그리고 홍수 이후의 언약을 중심으로 전개됩니다.",

    scripture: [
      "Genesis 6–9",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "period",
        "primeval-history",
        "RELATED_PERIOD",
        "원역사"
      ),

      relation(
        "person",
        "noah",
        "RELATED_PERSON",
        "노아"
      ),
    ],

    scenes: [
      {
        number:
          "01",

        title:
          "THE WARNING",

        scripture:
          "Genesis 6:9–22",

        description:
          "노아는 방주를 준비하라는 명령을 받습니다.",

        image:
          "",
      },

      {
        number:
          "02",

        title:
          "THE ARK",

        scripture:
          "Genesis 7:1–16",

        description:
          "노아의 가족과 생물들이 방주로 들어갑니다.",

        image:
          "",
      },

      {
        number:
          "03",

        title:
          "THE FLOOD",

        scripture:
          "Genesis 7:17–24",

        description:
          "물이 불어나며 홍수 이야기가 절정으로 향합니다.",

        image:
          "",
      },

      {
        number:
          "04",

        title:
          "A NEW BEGINNING",

        scripture:
          "Genesis 8:1–9:17",

        description:
          "물이 물러가고 노아의 가족은 새로운 시작을 맞습니다.",

        image:
          "",
      },
    ],
  }),


  /* =====================================================
     STORY — ABRAHAM
     ===================================================== */

  createSeed({
    type:
      "story",

    slug:
      "call-of-abraham",

    titleKo:
      "아브라함의 부르심",

    titleEn:
      "The Call of Abraham",

    eyebrow:
      "STORY · GENESIS 12",

    summary:
      "아브람이 익숙한 곳을 떠나 가나안을 향하며 족장 이야기가 시작됩니다.",

    order:
      30,

    biblicalSource:
      "Genesis 12:1–9",

    overview:
      "창세기 12장은 아브람이 고향을 떠나 하나님이 보여 줄 땅으로 향하는 장면으로 족장 이야기의 새로운 흐름을 시작합니다.",

    scripture: [
      "Genesis 12:1–9",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "person",
        "abraham",
        "RELATED_PERSON",
        "아브라함"
      ),

      relation(
        "place",
        "canaan",
        "RELATED_PLACE",
        "가나안"
      ),
    ],

    scenes: [
      {
        number:
          "01",

        title:
          "THE CALL",

        scripture:
          "Genesis 12:1–3",

        description:
          "아브람은 익숙한 땅을 떠나라는 부르심을 받습니다.",

        image:
          "",
      },

      {
        number:
          "02",

        title:
          "THE JOURNEY",

        scripture:
          "Genesis 12:4–5",

        description:
          "아브람은 가족과 함께 길을 떠납니다.",

        image:
          "",
      },

      {
        number:
          "03",

        title:
          "CANAAN",

        scripture:
          "Genesis 12:6–7",

        description:
          "아브람은 가나안 땅에 도착합니다.",

        image:
          "",
      },
    ],
  }),


  /* =====================================================
     PERSON — ADAM
     ===================================================== */

  createSeed({
    type:
      "person",

    slug:
      "adam",

    titleKo:
      "아담",

    titleEn:
      "Adam",

    eyebrow:
      "PEOPLE · GENESIS 1–5",

    summary:
      "창세기의 첫 인간으로 등장하며 에덴 이야기의 중심에 놓이는 인물입니다.",

    order:
      10,

    biblicalSource:
      "Genesis 1–5",

    overview:
      "아담은 창세기 1–5장에서 인간의 시작과 에덴의 이야기 속에 등장합니다.",

    scripture: [
      "Genesis 1–5",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "creation",
        "RELATED_STORY",
        "창조"
      ),

      relation(
        "place",
        "eden",
        "RELATED_PLACE",
        "에덴"
      ),
    ],
  }),


  /* =====================================================
     PERSON — NOAH
     ===================================================== */

  createSeed({
    type:
      "person",

    slug:
      "noah",

    titleKo:
      "노아",

    titleEn:
      "Noah",

    eyebrow:
      "PEOPLE · GENESIS 6–9",

    summary:
      "홍수 이야기에서 방주를 준비하고 가족과 함께 새로운 시작을 맞는 인물입니다.",

    order:
      20,

    biblicalSource:
      "Genesis 6–9",

    overview:
      "노아는 창세기의 홍수 이야기에서 중심이 되는 인물입니다.",

    scripture: [
      "Genesis 6–9",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "noah-and-the-flood",
        "RELATED_STORY",
        "노아와 홍수"
      ),

      relation(
        "period",
        "primeval-history",
        "RELATED_PERIOD",
        "원역사"
      ),
    ],
  }),


  /* =====================================================
     PERSON — ABRAHAM
     ===================================================== */

  createSeed({
    type:
      "person",

    slug:
      "abraham",

    titleKo:
      "아브라함",

    titleEn:
      "Abraham",

    eyebrow:
      "PEOPLE · PATRIARCH",

    summary:
      "창세기 족장 이야기의 중심 인물로 부르심과 언약의 이야기 속에 등장합니다.",

    order:
      30,

    biblicalSource:
      "Genesis 11:26–25:11",

    overview:
      "아브라함의 이야기는 창세기 12장부터 족장 서사의 중심을 이루며 가나안과 언약의 이야기를 연결합니다.",

    scripture: [
      "Genesis 11:26–25:11",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "call-of-abraham",
        "RELATED_STORY",
        "아브라함의 부르심"
      ),

      relation(
        "place",
        "canaan",
        "RELATED_PLACE",
        "가나안"
      ),
    ],
  }),


  /* =====================================================
     PLACE — EDEN
     ===================================================== */

  createSeed({
    type:
      "place",

    slug:
      "eden",

    titleKo:
      "에덴",

    titleEn:
      "Eden",

    eyebrow:
      "PLACES · GENESIS 2–3",

    summary:
      "아담의 이야기에서 등장하는 창세기의 정원입니다.",

    order:
      10,

    biblicalSource:
      "Genesis 2–3",

    overview:
      "에덴은 창세기 2–3장에서 인간의 시작과 관련된 장소로 등장합니다.",

    scripture: [
      "Genesis 2–3",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "creation",
        "RELATED_STORY",
        "창조"
      ),

      relation(
        "person",
        "adam",
        "RELATED_PERSON",
        "아담"
      ),
    ],
  }),


  /* =====================================================
     PLACE — CANAAN
     ===================================================== */

  createSeed({
    type:
      "place",

    slug:
      "canaan",

    titleKo:
      "가나안",

    titleEn:
      "Canaan",

    eyebrow:
      "PLACES · PATRIARCHAL WORLD",

    summary:
      "아브라함과 이후 족장들의 이야기에서 주요 배경으로 등장하는 지역입니다.",

    order:
      20,

    biblicalSource:
      "Genesis 12–50",

    overview:
      "가나안은 창세기 족장 이야기의 주요 공간적 배경입니다.",

    scripture: [
      "Genesis 12–50",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "call-of-abraham",
        "RELATED_STORY",
        "아브라함의 부르심"
      ),

      relation(
        "person",
        "abraham",
        "RELATED_PERSON",
        "아브라함"
      ),
    ],
  }),


  /* =====================================================
     PERIOD — PRIMEVAL HISTORY
     ===================================================== */

  createSeed({
    type:
      "period",

    slug:
      "primeval-history",

    titleKo:
      "원역사",

    titleEn:
      "Primeval History",

    eyebrow:
      "TIMELINE · GENESIS 1–11",

    summary:
      "창조에서 홍수와 바벨 이야기까지 이어지는 창세기 1–11장의 이야기 구간입니다.",

    order:
      10,

    biblicalSource:
      "Genesis 1–11",

    overview:
      "창세기 1–11장을 하나의 타임라인 구간으로 묶어 창조와 인간 초기의 이야기, 홍수와 바벨까지의 흐름을 탐색합니다.",

    scripture: [
      "Genesis 1–11",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "creation",
        "RELATED_STORY",
        "창조"
      ),

      relation(
        "story",
        "noah-and-the-flood",
        "RELATED_STORY",
        "노아와 홍수"
      ),

      relation(
        "person",
        "adam",
        "RELATED_PERSON",
        "아담"
      ),

      relation(
        "person",
        "noah",
        "RELATED_PERSON",
        "노아"
      ),
    ],
  }),


  /* =====================================================
     VISUAL — CREATION
     ===================================================== */

  createSeed({
    type:
      "visual",

    slug:
      "creation-visual",

    titleKo:
      "창조",

    titleEn:
      "Creation",

    eyebrow:
      "VISUAL · GENESIS 1–2",

    summary:
      "창조 이야기를 성경 본문을 바탕으로 시각적으로 탐색하는 콘텐츠입니다.",

    order:
      10,

    biblicalSource:
      "Genesis 1–2",

    overview:
      "창세기 1–2장의 창조 이야기를 시각 콘텐츠로 구성합니다.",

    scripture: [
      "Genesis 1–2",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "creation",
        "RELATED_STORY",
        "창조"
      ),

      relation(
        "period",
        "primeval-history",
        "RELATED_PERIOD",
        "원역사"
      ),
    ],
  }),


  /* =====================================================
     VISUAL — NOAH
     ===================================================== */

  createSeed({
    type:
      "visual",

    slug:
      "noah-ark-visual",

    titleKo:
      "노아의 방주",

    titleEn:
      "Noah's Ark",

    eyebrow:
      "VISUAL · GENESIS 6–9",

    summary:
      "노아와 방주 이야기를 시각적으로 탐색하는 콘텐츠입니다.",

    order:
      20,

    biblicalSource:
      "Genesis 6–9",

    overview:
      "창세기 6–9장의 노아와 방주 이야기를 시각 콘텐츠로 구성합니다.",

    scripture: [
      "Genesis 6–9",
    ],

    relations: [
      relation(
        "book",
        "genesis",
        "RELATED_BOOK",
        "창세기"
      ),

      relation(
        "story",
        "noah-and-the-flood",
        "RELATED_STORY",
        "노아와 홍수"
      ),

      relation(
        "person",
        "noah",
        "RELATED_PERSON",
        "노아"
      ),
    ],
  }),
];


/* =====================================================
   PAGE
   ===================================================== */

export default function GenesisSeedPage() {
  const router =
    useRouter();


  const [
    authLoading,
    setAuthLoading,
  ] =
    useState(true);


  const [
    running,
    setRunning,
  ] =
    useState(false);


  const [
    createdCount,
    setCreatedCount,
  ] =
    useState(0);


  const [
    skippedCount,
    setSkippedCount,
  ] =
    useState(0);


  const [
    message,
    setMessage,
  ] =
    useState("");


  /* =====================================================
     ADMIN CHECK
     ===================================================== */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          user
        ) => {

          if (
            !user ||
            !user.email
          ) {
            router.replace(
              "/admin/login"
            );

            return;
          }


          try {
            const operatorRef =
              doc(
                db,
                "operators",
                user.email
              );


            const operatorSnapshot =
              await getDoc(
                operatorRef
              );


            if (
              !operatorSnapshot.exists()
            ) {
              await signOut(
                auth
              );


              router.replace(
                "/admin/login"
              );

              return;
            }


            const operator =
              operatorSnapshot.data();


            if (
              operator.active !==
                true ||
              operator.role !==
                "admin"
            ) {
              await signOut(
                auth
              );


              router.replace(
                "/admin/login"
              );

              return;
            }


            setAuthLoading(
              false
            );

          } catch (
            error
          ) {
            console.error(
              "관리자 권한 확인 오류:",
              error
            );


            await signOut(
              auth
            );


            router.replace(
              "/admin/login"
            );
          }
        }
      );


    return () => {
      unsubscribe();
    };

  }, [
    router,
  ]);


  /* =====================================================
     CREATE GENESIS CONTENT
     ===================================================== */

  const handleSeed =
    async () => {

      if (
        running
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          `창세기 콘텐츠 ${genesisSeed.length}개를 생성합니다.\n\n기존 문서는 덮어쓰지 않으며 모두 Draft 상태로 생성됩니다.\n\n계속하시겠습니까?`
        );


      if (
        !confirmed
      ) {
        return;
      }


      setRunning(
        true
      );

      setMessage(
        ""
      );

      setCreatedCount(
        0
      );

      setSkippedCount(
        0
      );


      let created =
        0;

      let skipped =
        0;


      try {

        for (
          const item
          of genesisSeed
        ) {

          const contentId =
            `${item.type}__${item.slug}`;


          const contentRef =
            doc(
              db,
              "contents",
              contentId
            );


          const existing =
            await getDoc(
              contentRef
            );


          /*
           * 기존 문서는 절대 덮지 않음
           */

          if (
            existing.exists()
          ) {
            skipped +=
              1;

            setSkippedCount(
              skipped
            );

            continue;
          }


          await setDoc(
            contentRef,
            {
              ...item,

              createdAt:
                serverTimestamp(),

              updatedAt:
                serverTimestamp(),
            }
          );


          created +=
            1;


          setCreatedCount(
            created
          );
        }


        setMessage(
          `창세기 Seed 생성 완료 · 신규 ${created}개 / 기존 문서 ${skipped}개 건너뜀`
        );

      } catch (
        error
      ) {
        console.error(
          "창세기 Seed 생성 오류:",
          error
        );


        setMessage(
          "창세기 Seed 생성 중 오류가 발생했습니다."
        );

      } finally {
        setRunning(
          false
        );
      }
    };


  /* =====================================================
     LOADING
     ===================================================== */

  if (
    authLoading
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",

          padding:
            "60px",

          background:
            "#08110d",

          color:
            "#f4efe3",
        }}
      >
        관리자 권한을 확인하고 있습니다.
      </main>
    );
  }


  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#08110d",

        color:
          "#f4efe3",

        padding:
          "64px 24px",
      }}
    >

      <div
        style={{
          width:
            "100%",

          maxWidth:
            "900px",

          margin:
            "0 auto",
        }}
      >

        <Link
          href="/admin/contents"
          style={{
            color:
              "#c9a86a",

            textDecoration:
              "none",
          }}
        >
          ← CONTENTS
        </Link>


        <section
          style={{
            marginTop:
              "28px",

            padding:
              "36px",

            border:
              "1px solid rgba(201,168,106,0.35)",

            borderRadius:
              "16px",

            background:
              "#0d1813",
          }}
        >

          <small
            style={{
              color:
                "#c9a86a",

              letterSpacing:
                "0.15em",
            }}
          >
            GENESIS CONTENT SEED
          </small>


          <h1
            style={{
              margin:
                "12px 0",

              fontSize:
                "38px",
            }}
          >
            창세기 콘텐츠 확장
          </h1>


          <p
            style={{
              color:
                "#c8c2b7",

              lineHeight:
                1.8,
            }}
          >
            사무엘상과 동일한 콘텐츠 구조로
            STORIES · PEOPLE · PLACES ·
            TIMELINE · BIBLE · VISUAL의
            창세기 Seed를 생성합니다.
          </p>


          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(3, 1fr)",

              gap:
                "12px",

              marginTop:
                "30px",
            }}
          >

            <div>
              <small>
                TOTAL
              </small>

              <h2>
                {genesisSeed.length}
              </h2>
            </div>


            <div>
              <small>
                CREATED
              </small>

              <h2>
                {createdCount}
              </h2>
            </div>


            <div>
              <small>
                SKIPPED
              </small>

              <h2>
                {skippedCount}
              </h2>
            </div>

          </div>


          <button
            type="button"
            disabled={
              running
            }
            onClick={
              handleSeed
            }
            style={{
              width:
                "100%",

              marginTop:
                "30px",

              padding:
                "17px",

              border:
                "none",

              borderRadius:
                "10px",

              background:
                running
                  ? "#605744"
                  : "#c9a86a",

              color:
                "#08110d",

              fontWeight:
                800,

              cursor:
                running
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {running
              ? "창세기 Seed 생성 중..."
              : "창세기 Seed 생성"}
          </button>


          {message && (
            <p
              style={{
                marginTop:
                  "24px",

                padding:
                  "16px",

                background:
                  "rgba(255,255,255,0.05)",

                borderRadius:
                  "10px",
              }}
            >
              {message}
            </p>
          )}

        </section>

      </div>

    </main>
  );
}