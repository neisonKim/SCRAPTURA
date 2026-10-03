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


/* =====================================================
   TYPES
   ===================================================== */

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
  targetType: RelationTargetType;
  targetSlug: string;
  relationType: RelationType;
  label: string;
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

  bookSections: BookSection[];

  relations: BibleRelation[];
};


/* =====================================================
   BOOK SLUG ALIASES

   URL / Firestore에서 사용하는 slug와
   data/content.ts의 slug가 다른 경우를 처리한다.
   ===================================================== */

const BOOK_SLUG_ALIASES:
  Record<string, string> = {

  joshua:
    "book-of-joshua",
};


/* =====================================================
   NORMALIZE SLUG
   ===================================================== */

function normalizeSlug(
  value: string
): string {

  return value
    .trim()
    .toLowerCase();
}


/* =====================================================
   RESOLVE LOCAL BOOK SLUG
   ===================================================== */

function resolveLocalBookSlug(
  slugValue: string
): string {

  const requestedSlug =
    normalizeSlug(
      slugValue
    );

  return (
    BOOK_SLUG_ALIASES[
      requestedSlug
    ] ??
    requestedSlug
  );
}


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


        const number =
          typeof source.number ===
            "string"
            ? source.number
            : typeof source.number ===
                "number"
              ? String(
                  source.number
                ).padStart(
                  2,
                  "0"
                )
              : String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                );


        return {
          number,

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


  const validTargetTypes:
    RelationTargetType[] = [
      "story",
      "person",
      "place",
      "period",
      "book",
      "visual",
    ];


  const validRelationTypes:
    RelationType[] = [
      "RELATED_PERSON",
      "RELATED_PLACE",
      "RELATED_PERIOD",
      "RELATED_BOOK",
      "RELATED_STORY",
    ];


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


      if (
        !validTargetTypes.includes(
          data.targetType as
            RelationTargetType
        )
      ) {
        return;
      }


      if (
        !validRelationTypes.includes(
          data.relationType as
            RelationType
        )
      ) {
        return;
      }


      const targetSlug =
        data.targetSlug
          .trim()
          .toLowerCase();


      if (
        !targetSlug
      ) {
        return;
      }


      result.push({
        targetType:
          data.targetType as
            RelationTargetType,

        targetSlug,

        relationType:
          data.relationType as
            RelationType,

        label:
          data.label.trim(),
      });
    }
  );


  /*
   * 동일 대상 Relation 중복 제거
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
   MERGE SCRIPTURE

   Local + Firestore를 합치되
   중복 본문 범위는 제거한다.
   ===================================================== */

function mergeScripture(
  ...sources: unknown[]
): string[] {

  const result =
    sources.flatMap(
      (
        source
      ) =>
        normalizeScripture(
          source
        )
    );


  return Array.from(
    new Set(
      result
    )
  );
}


/* =====================================================
   MERGE BOOK SECTIONS

   Local 데이터를 기본으로 유지한다.
   동일 번호의 Firestore 데이터가 있으면
   해당 항목을 보완/갱신한다.
   ===================================================== */

function mergeBookSections(
  localValue: unknown,
  firestoreValue: unknown
): BookSection[] {

  const localSections =
    normalizeBookSections(
      localValue
    );

  const firestoreSections =
    normalizeBookSections(
      firestoreValue
    );


  const map =
    new Map<
      string,
      BookSection
    >();


  localSections.forEach(
    (
      section,
      index
    ) => {

      const key =
        section.number ||
        section.title ||
        String(
          index
        );

      map.set(
        key,
        section
      );
    }
  );


  firestoreSections.forEach(
    (
      section,
      index
    ) => {

      const key =
        section.number ||
        section.title ||
        String(
          index
        );


      const previous =
        map.get(
          key
        );


      map.set(
        key,
        {
          number:
            section.number ||
            previous?.number ||
            String(
              index + 1
            ).padStart(
              2,
              "0"
            ),

          title:
            section.title ||
            previous?.title ||
            "",

          scripture:
            section.scripture ||
            previous?.scripture ||
            "",

          description:
            section.description ||
            previous?.description ||
            "",
        }
      );
    }
  );


  return Array.from(
    map.values()
  );
}


/* =====================================================
   MERGE RELATIONS

   매우 중요:
   Firestore relations가 일부만 있어도
   content.ts의 Relations가 사라지지 않도록
   두 데이터를 합친다.
   ===================================================== */

function mergeRelations(
  localValue: unknown,
  firestoreValue: unknown
): BibleRelation[] {

  const localRelations =
    normalizeRelations(
      localValue
    );


  const firestoreRelations =
    normalizeRelations(
      firestoreValue
    );


  const map =
    new Map<
      string,
      BibleRelation
    >();


  /*
   * 먼저 Local 관계 등록
   */

  localRelations.forEach(
    (
      relation
    ) => {

      map.set(
        `${relation.targetType}__${relation.targetSlug}`,
        relation
      );
    }
  );


  /*
   * Firestore 동일 관계가 있으면
   * Firestore 데이터를 우선 적용
   */

  firestoreRelations.forEach(
    (
      relation
    ) => {

      map.set(
        `${relation.targetType}__${relation.targetSlug}`,
        relation
      );
    }
  );


  return Array.from(
    map.values()
  );
}


/* =====================================================
   LOCAL CONTENT.TS BOOK
   ===================================================== */

function getLocalBook(
  slugValue: string
): BibleBook | null {

  const requestedSlug =
    normalizeSlug(
      slugValue
    );


  if (
    !requestedSlug
  ) {
    return null;
  }


  /*
   * /bible/joshua
   *
   * 또는
   *
   * /bible/book-of-joshua
   *
   * 둘 다 Local:
   *
   * book-of-joshua
   *
   * Node를 찾도록 처리한다.
   */

  const localSlug =
    resolveLocalBookSlug(
      requestedSlug
    );


  const node =
    getNode(
      "book",
      localSlug
    );


  if (
    !node
  ) {
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
      normalizeScripture(
        node.scripture ??
        []
      ),

    bookSections:
      normalizeBookSections(
        node.bookSections ??
        []
      ),

    relations:
      normalizeRelations(
        node.relations ??
        []
      ),
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
   * URL에서 받은 slug
   */

  const requestedSlug =
    useMemo(
      () =>
        normalizeSlug(
          slug
        ),
      [
        slug,
      ]
    );


  /*
   * Local content.ts Book
   *
   * 페이지가 렌더링되는 즉시 확보한다.
   */

  const localBook =
    useMemo(
      () =>
        getLocalBook(
          requestedSlug
        ),
      [
        requestedSlug,
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
    useState(
      true
    );


  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState(
      ""
    );


  /* =====================================================
     FIRESTORE + LOCAL MERGE
     ===================================================== */

  useEffect(
    () => {

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
             * Firestore 응답을 기다리는 동안에도
             * Local Book 콘텐츠를 즉시 보여 준다.
             */

            setBook(
              localBook
            );


            /*
             * Firestore에서 검색할 후보 slug.
             *
             * 예:
             *
             * requestedSlug:
             * joshua
             *
             * local slug:
             * book-of-joshua
             *
             * 두 가지를 모두 조회한다.
             */

            const firestoreSlugs =
              Array.from(
                new Set(
                  [
                    requestedSlug,

                    resolveLocalBookSlug(
                      requestedSlug
                    ),

                    localBook?.slug,
                  ]
                    .filter(
                      (
                        value
                      ): value is string =>
                        typeof value ===
                          "string" &&
                        Boolean(
                          value.trim()
                        )
                    )
                    .map(
                      (
                        value
                      ) =>
                        normalizeSlug(
                          value
                        )
                    )
                )
              );


            let firestoreData:
              Record<
                string,
                unknown
              > | null =
              null;


            /*
             * 복합 IN Query를 사용하지 않고
             * slug별로 순차 조회한다.
             *
             * Firestore 추가 index 요구를
             * 최대한 피하기 위함이다.
             */

            for (
              const candidateSlug
              of firestoreSlugs
            ) {

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
                    candidateSlug
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


              if (
                documentSnapshot
              ) {

                firestoreData =
                  documentSnapshot.data() as
                    Record<
                      string,
                      unknown
                    >;

                break;
              }
            }


            /*
             * Firestore Book가 없다면
             * Local Book 유지
             */

            if (
              !firestoreData
            ) {

              if (
                !cancelled
              ) {

                setBook(
                  localBook
                );

              }

              return;
            }


            const data =
              firestoreData;


            /* =================================================
               STRING VALUES
               ================================================= */

            const firebaseSlug =
              typeof data.slug ===
                "string" &&
              data.slug.trim()
                ? data.slug.trim()
                : localBook?.slug ??
                  requestedSlug;


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


            const firebaseEyebrow =
              typeof data.eyebrow ===
                "string" &&
              data.eyebrow.trim()
                ? data.eyebrow
                : localBook?.eyebrow ??
                  "BIBLE";


            const firebaseHeroImage =
              typeof data.heroImage ===
                "string" &&
              data.heroImage.trim()
                ? data.heroImage
                : localBook?.heroImage ??
                  "/assets/scraptura-home-clean.jpg";


            const firebaseOverview =
              typeof data.overview ===
                "string" &&
              data.overview.trim()
                ? data.overview
                : localBook?.overview;


            const firebaseBiblicalContext =
              typeof data.biblicalContext ===
                "string" &&
              data.biblicalContext.trim()
                ? data.biblicalContext
                : localBook?.biblicalContext;


            /* =================================================
               MERGED ARRAYS
               ================================================= */

            const scripture =
              mergeScripture(
                localBook?.scripture ??
                [],

                data.scripture
              );


            const bookSections =
              mergeBookSections(
                localBook?.bookSections ??
                [],

                data.bookSections
              );


            const relations =
              mergeRelations(
                localBook?.relations ??
                [],

                data.relations
              );


            /*
             * Local slug를 canonical slug로 사용.
             *
             * Firestore에 예전 "joshua" slug가
             * 존재해도 화면 데이터는
             * book-of-joshua 구조를 유지한다.
             */

            const canonicalSlug =
              localBook?.slug ??
              firebaseSlug;


            const mergedBook:
              BibleBook = {

              slug:
                canonicalSlug,

              titleKo:
                firebaseTitleKo,

              titleEn:
                firebaseTitleEn,

              eyebrow:
                firebaseEyebrow,

              summary:
                firebaseSummary,

              heroImage:
                firebaseHeroImage,

              overview:
                firebaseOverview,

              biblicalContext:
                firebaseBiblicalContext,

              scripture,

              bookSections,

              relations,
            };


            if (
              !cancelled
            ) {

              setBook(
                mergedBook
              );

            }

          }
          catch (
            error
          ) {

            console.error(
              "BIBLE detail Firestore error:",
              error
            );


            if (
              cancelled
            ) {
              return;
            }


            /*
             * Firestore 오류가 발생해도
             * Local Book가 존재하면
             * 페이지를 정상적으로 유지한다.
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
          finally {

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

    },
    [
      requestedSlug,
      localBook,
    ]
  );


  /* =====================================================
     LOADING
     ===================================================== */

  if (
    loading &&
    !book
  ) {

    return (
      <main
        className="contentWrap"
      >

        <section
          className="overview"
        >

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
      <main
        className="contentWrap"
      >

        <section
          className="overview"
        >

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
      <main
        className="contentWrap"
      >

        <section
          className="overview"
        >

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

      {/* =================================
          HERO
      ================================= */}

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

        {/* =================================
            OVERVIEW
        ================================= */}

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


        {/* =================================
            BIBLICAL CONTEXT
        ================================= */}

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


        {/* =================================
            BOOK JOURNEY
        ================================= */}

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


        {/* =================================
            SCRIPTURE
        ================================= */}

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


        {/* =================================
            RELATED CONTENT
        ================================= */}

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