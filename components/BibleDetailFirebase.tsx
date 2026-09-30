"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import Hero from "./Hero";
import RelationCards from "./RelationCards";

import {
  db,
} from "../lib/firebase";

import {
  getNode,
} from "../data/content";


type BookSection = {
  number: string;
  title: string;
  scripture: string;
  description: string;
};


type RelationTargetType =
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


type BibleRelation = {
  targetType:
    RelationTargetType;

  targetSlug:
    string;

  relationType:
    RelationType;

  label:
    string;
};


type BibleBook = {
  slug: string;

  titleKo: string;
  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  overview?: string;

  biblicalContext?: string;

  scripture: string[];

  bookSections:
    BookSection[];

  relations:
    BibleRelation[];
};


/* =====================================================
   BOOK SECTION NORMALIZER
   ===================================================== */

function normalizeBookSections(
  value: unknown
): BookSection[] {

  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  return value
    .filter(
      (
        section
      ) =>
        typeof section ===
          "object" &&
        section !==
          null
    )
    .map(
      (
        section,
        index
      ) => {

        const source =
          section as Record<
            string,
            unknown
          >;


        return {
          number:
            typeof source.number ===
            "string"
              ? source.number
              : String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                ),

          title:
            typeof source.title ===
            "string"
              ? source.title
              : "",

          scripture:
            typeof source.scripture ===
            "string"
              ? source.scripture
              : "",

          description:
            typeof source.description ===
            "string"
              ? source.description
              : "",
        };
      }
    );
}


/* =====================================================
   SCRIPTURE NORMALIZER
   ===================================================== */

function normalizeScripture(
  value: unknown
): string[] {

  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
          "string"
    )
    .map(
      (
        item
      ) =>
        item.trim()
    )
    .filter(
      Boolean
    );
}


/* =====================================================
   RELATION NORMALIZER
   ===================================================== */

function normalizeRelations(
  value: unknown
): BibleRelation[] {

  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  const result:
    BibleRelation[] = [];


  value.forEach(
    (
      relation
    ) => {

      if (
        typeof relation !==
          "object" ||
        relation ===
          null
      ) {
        return;
      }


      const data =
        relation as Record<
          string,
          unknown
        >;


      if (
        typeof data.targetType !==
          "string" ||

        typeof data.targetSlug !==
          "string" ||

        typeof data.relationType !==
          "string" ||

        typeof data.label !==
          "string"
      ) {
        return;
      }


      result.push({
        targetType:
          data.targetType as
            RelationTargetType,

        targetSlug:
          data.targetSlug,

        relationType:
          data.relationType as
            RelationType,

        label:
          data.label,
      });
    }
  );


  /*
   * 같은 대상 Relation 중복 제거
   */

  return Array.from(
    new Map(
      result.map(
        (
          relation
        ) => [
          `${relation.targetType}__${relation.targetSlug}`,
          relation,
        ]
      )
    ).values()
  );
}


/* =====================================================
   LOCAL CONTENT.TS FALLBACK
   ===================================================== */

function getLocalBook(
  slugValue: string
): BibleBook | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();


  if (!slug) {
    return null;
  }


  const node =
    getNode(
      "book",
      slug
    );


  if (!node) {
    return null;
  }


  return {
    slug:
      node.slug,

    titleKo:
      node.titleKo,

    titleEn:
      node.titleEn,

    eyebrow:
      node.eyebrow ||
      "BIBLE",

    summary:
      node.summary,

    heroImage:
      node.heroImage ||
      "/assets/scraptura-home-clean.jpg",

    overview:
      node.overview,

    biblicalContext:
      node.biblicalContext,

    scripture:
      node.scripture ??
      [],

    bookSections:
      node.bookSections ??
      [],

    relations:
      node.relations ??
      [],
  };
}


/* =====================================================
   COMPONENT
   ===================================================== */

export default function BibleDetailFirebase({
  slug,
}: {
  slug: string;
}) {

  /*
   * content.ts Book는
   * 렌더링 즉시 확보
   */

  const localBook =
    useMemo(
      () =>
        getLocalBook(
          slug
        ),
      [
        slug,
      ]
    );


  const [
    book,
    setBook,
  ] =
    useState<BibleBook | null>(
      localBook
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");


  /* =====================================================
     FIRESTORE + LOCAL FALLBACK
     ===================================================== */

  useEffect(() => {

    let cancelled =
      false;


    const loadBook =
      async () => {

        try {

          setLoading(
            true
          );

          setErrorMessage(
            ""
          );


          /*
           * slug가 변경되면 우선
           * Local Book으로 초기화
           */

          setBook(
            localBook
          );


          /*
           * 일반 사용자는 Firestore의
           * published 콘텐츠만 조회
           */

          const bookQuery =
            query(
              collection(
                db,
                "contents"
              ),

              where(
                "status",
                "==",
                "published"
              ),

              where(
                "slug",
                "==",
                slug
              )
            );


          const snapshot =
            await getDocs(
              bookQuery
            );


          if (
            cancelled
          ) {
            return;
          }


          /*
           * 동일 slug 중
           * type === book
           */

          const documentSnapshot =
            snapshot.docs.find(
              (
                document
              ) => {

                const data =
                  document.data();


                return (
                  data.type ===
                  "book"
                );
              }
            );


          /*
           * Firestore Book가 없다면
           * content.ts를 그대로 사용
           */

          if (
            !documentSnapshot
          ) {

            setBook(
              localBook
            );

            return;
          }


          const data =
            documentSnapshot.data();


          /* =================================================
             REQUIRED FIRESTORE VALUES
             ================================================= */

          const firebaseSlug =
            typeof data.slug ===
              "string" &&
            data.slug.trim()
              ? data.slug
              : localBook?.slug ??
                slug;


          const firebaseTitleKo =
            typeof data.titleKo ===
              "string" &&
            data.titleKo.trim()
              ? data.titleKo
              : localBook?.titleKo ??
                "";


          const firebaseTitleEn =
            typeof data.titleEn ===
              "string" &&
            data.titleEn.trim()
              ? data.titleEn
              : localBook?.titleEn ??
                "";


          const firebaseSummary =
            typeof data.summary ===
              "string" &&
            data.summary.trim()
              ? data.summary
              : localBook?.summary ??
                "";


          /*
           * Firestore에 published Book가
           * 실제로 존재하므로
           * Firestore 값을 우선 사용하고
           * 비어 있는 필드는 Local에서 보충
           */

          const firestoreScripture =
            normalizeScripture(
              data.scripture
            );


          const firestoreBookSections =
            normalizeBookSections(
              data.bookSections
            );


          const firestoreRelations =
            normalizeRelations(
              data.relations
            );


          const firebaseBook:
            BibleBook = {

            slug:
              firebaseSlug,

            titleKo:
              firebaseTitleKo,

            titleEn:
              firebaseTitleEn,

            eyebrow:
              typeof data.eyebrow ===
                "string" &&
              data.eyebrow.trim()
                ? data.eyebrow
                : localBook?.eyebrow ??
                  "BIBLE",

            summary:
              firebaseSummary,

            heroImage:
              typeof data.heroImage ===
                "string" &&
              data.heroImage.trim()
                ? data.heroImage
                : localBook?.heroImage ??
                  "/assets/scraptura-home-clean.jpg",

            overview:
              typeof data.overview ===
                "string" &&
              data.overview.trim()
                ? data.overview
                : localBook?.overview,

            biblicalContext:
              typeof data.biblicalContext ===
                "string" &&
              data.biblicalContext.trim()
                ? data.biblicalContext
                : localBook?.biblicalContext,

            scripture:
              firestoreScripture.length >
              0
                ? firestoreScripture
                : localBook
                    ?.scripture ??
                  [],

            bookSections:
              firestoreBookSections.length >
              0
                ? firestoreBookSections
                : localBook
                    ?.bookSections ??
                  [],

            relations:
              firestoreRelations.length >
              0
                ? firestoreRelations
                : localBook
                    ?.relations ??
                  [],
          };


          setBook(
            firebaseBook
          );

        } catch (
          error
        ) {

          console.error(
            "BIBLE detail Firestore error:",
            error
          );


          if (
            !cancelled
          ) {

            /*
             * Firestore 오류가 발생해도
             * Local Book가 있다면 페이지 유지
             */

            if (
              localBook
            ) {

              setBook(
                localBook
              );

              setErrorMessage(
                ""
              );

            }
            else {

              setBook(
                null
              );

              setErrorMessage(
                "성경 콘텐츠를 불러오지 못했습니다."
              );

            }

          }

        } finally {

          if (
            !cancelled
          ) {

            setLoading(
              false
            );

          }

        }

      };


    loadBook();


    return () => {

      cancelled =
        true;

    };

  }, [
    slug,
    localBook,
  ]);


  /* =====================================================
     LOADING
     ===================================================== */

  if (
    loading &&
    !book
  ) {

    return (
      <main className="contentWrap">

        <section className="overview">

          <small>
            BIBLE
          </small>


          <h3>
            콘텐츠를 불러오고 있습니다.
          </h3>

        </section>

      </main>
    );
  }


  /* =====================================================
     ERROR
     ===================================================== */

  if (
    errorMessage &&
    !book
  ) {

    return (
      <main className="contentWrap">

        <section className="overview">

          <small>
            BIBLE
          </small>


          <h3>
            {errorMessage}
          </h3>

        </section>

      </main>
    );
  }


  /* =====================================================
     NOT FOUND
     ===================================================== */

  if (
    !book
  ) {

    return (
      <main className="contentWrap">

        <section className="overview">

          <small>
            BIBLE
          </small>


          <h3>
            공개된 성경 콘텐츠가 없습니다.
          </h3>


          <p>
            Firestore와 로컬 콘텐츠에서
            해당 성경 콘텐츠를 찾지 못했습니다.
          </p>

        </section>

      </main>
    );
  }


  /* =====================================================
     CONTENT
     ===================================================== */

  return (
    <main>

      {/* HERO */}

      <Hero
        eyebrow={
          book.eyebrow
        }

        titleKo={
          book.titleKo
        }

        titleEn={
          book.titleEn
        }

        summary={
          book.summary
        }

        image={
          book.heroImage
        }
      />


      <div
        className="contentWrap"
      >

        {/* OVERVIEW */}

        <section
          className="overview"
        >

          <small>
            OVERVIEW
          </small>


          <h3>
            {book.titleKo} 탐험
          </h3>


          <p>
            {
              book.overview ??
              book.summary
            }
          </p>

        </section>


        {/* BIBLICAL CONTEXT */}

        {
          book.biblicalContext &&
          (

            <section
              className="journey"
            >

              <small>
                BIBLICAL CONTEXT
              </small>


              <h3>
                책의 흐름과 배경
              </h3>


              <p>
                {
                  book.biblicalContext
                }
              </p>

            </section>

          )
        }


        {/* BOOK JOURNEY */}

        {
          book
            .bookSections
            .length >
          0 &&
          (

            <section
              className=
                "journey characterJourney"
            >

              <div
                className=
                  "characterJourneyHeader"
              >

                <small>
                  BOOK JOURNEY
                </small>


                <h3>
                  {
                    book.titleKo
                  }의 주요 흐름
                </h3>


                <p>
                  성경의 장별 흐름을 따라
                  주요 인물과 사건이 어떻게
                  연결되는지 살펴봅니다.
                </p>

              </div>


              <div
                className=
                  "characterJourneyList"
              >

                {
                  book.bookSections.map(
                    (
                      section,
                      index
                    ) => (

                      <article
                        className=
                          "characterStage"

                        key={
                          `${section.number}-${index}`
                        }
                      >

                        <div
                          className=
                            "characterStageNumber"
                        >
                          {
                            section.number
                          }
                        </div>


                        <div
                          className=
                            "characterStageContent"
                        >

                          <small>
                            {
                              section.scripture
                            }
                          </small>


                          <h4>
                            {
                              section.title
                            }
                          </h4>


                          <p>
                            {
                              section.description
                            }
                          </p>

                        </div>

                      </article>

                    )
                  )
                }

              </div>

            </section>

          )
        }


        {/* SCRIPTURE */}

        {
          book
            .scripture
            .length >
          0 &&
          (

            <section
              className="journey"
            >

              <small>
                SCRIPTURE
              </small>


              <h3>
                본문 범위
              </h3>


              <p>
                {
                  book.scripture.join(
                    " · "
                  )
                }
              </p>

            </section>

          )
        }


        {/* RELATED CONTENT */}

        {
          book
            .relations
            .length >
          0 &&
          (

            <RelationCards
              items={
                book.relations
              }
            />

          )
        }

      </div>

    </main>
  );
}