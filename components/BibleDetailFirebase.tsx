"use client";

import {
  useEffect,
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


/*
 * =====================================
 * STRING CHECK
 * =====================================
 */

function hasText(
  value: unknown
):
  value is string {

  return (
    typeof value ===
      "string" &&
    value.trim().length >
      0
  );
}


/*
 * =====================================
 * STRING ARRAY NORMALIZER
 * =====================================
 */

function normalizeStringArray(
  value: unknown
):
  string[] {

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
      ):
        item is string =>
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
      (
        item
      ) =>
        item.length >
        0
    );
}


/*
 * =====================================
 * BOOK SECTION NORMALIZER
 * =====================================
 */

function normalizeBookSections(
  value: unknown
):
  BookSection[] {

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
    )
    .filter(
      (
        section
      ) =>
        section.title.trim() !==
          "" ||
        section.scripture.trim() !==
          "" ||
        section.description.trim() !==
          ""
    );
}


/*
 * =====================================
 * BOOK SECTION MERGER
 *
 * LOCAL 데이터를 먼저 넣고
 * FIRESTORE 데이터가 있으면
 * 같은 번호를 덮어씁니다.
 *
 * 따라서 Firestore가 우선이며
 * 누락된 Section만 local에서
 * 보완합니다.
 * =====================================
 */

function mergeBookSections(
  firebaseSections:
    BookSection[],
  localSections:
    BookSection[]
):
  BookSection[] {

  const sectionMap =
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
        section.number.trim() ||
        String(
          index + 1
        );


      sectionMap.set(
        key,
        section
      );

    }
  );


  firebaseSections.forEach(
    (
      section,
      index
    ) => {

      const key =
        section.number.trim() ||
        String(
          index + 1
        );


      sectionMap.set(
        key,
        section
      );

    }
  );


  return Array.from(
    sectionMap.values()
  );
}


/*
 * =====================================
 * RELATION NORMALIZER
 * =====================================
 */

function normalizeRelations(
  value: unknown
):
  BibleRelation[] {

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


  return result;
}


/*
 * =====================================
 * RELATION MERGER
 *
 * Firestore + local 관계를 합치고
 * 같은 관계는 중복 제거합니다.
 * =====================================
 */

function mergeRelations(
  firebaseRelations:
    BibleRelation[],
  localRelations:
    BibleRelation[]
):
  BibleRelation[] {

  const relationMap =
    new Map<
      string,
      BibleRelation
    >();


  /*
   * LOCAL
   */

  localRelations.forEach(
    (
      relation
    ) => {

      const key =
        [
          relation.targetType,
          relation.targetSlug,
          relation.relationType,
        ].join(
          "::"
        );


      relationMap.set(
        key,
        relation
      );

    }
  );


  /*
   * FIRESTORE
   *
   * 동일 관계는 Firestore 값을
   * 최종 우선합니다.
   */

  firebaseRelations.forEach(
    (
      relation
    ) => {

      const key =
        [
          relation.targetType,
          relation.targetSlug,
          relation.relationType,
        ].join(
          "::"
        );


      relationMap.set(
        key,
        relation
      );

    }
  );


  return Array.from(
    relationMap.values()
  );
}


/*
 * =====================================
 * COMPONENT
 * =====================================
 */

export default function BibleDetailFirebase({
  slug,
}: {
  slug: string;
}) {

  const [
    book,
    setBook,
  ] =
    useState<BibleBook | null>(
      null
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


  /*
   * =====================================
   * FIRESTORE
   * =====================================
   */

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
           * ---------------------------------
           * LOCAL FALLBACK
           *
           * data/content.ts
           * ---------------------------------
           */

          const localNode =
            getNode(
              "book",
              slug
            );


          const localScripture =
            normalizeStringArray(
              localNode?.scripture
            );


          const localBookSections =
            normalizeBookSections(
              localNode?.bookSections
            );


          const localRelations =
            normalizeRelations(
              localNode?.relations
            );


          /*
           * ---------------------------------
           * FIRESTORE
           *
           * 일반 사용자는 published
           * 콘텐츠만 조회
           * ---------------------------------
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
           * 같은 slug 중
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
           * Firestore Published 문서가
           * 존재해야 공개 페이지 노출.
           *
           * local content는 상세 필드
           * 보완 용도로만 사용합니다.
           */

          if (
            !documentSnapshot
          ) {

            setBook(
              null
            );

            return;

          }


          const data =
            documentSnapshot.data();


          /*
           * REQUIRED
           */

          if (
            typeof data.slug !==
              "string" ||

            typeof data.titleKo !==
              "string" ||

            typeof data.titleEn !==
              "string" ||

            typeof data.summary !==
              "string"
          ) {

            throw new Error(
              "BIBLE 콘텐츠의 필수 필드가 올바르지 않습니다."
            );

          }


          /*
           * ---------------------------------
           * FIRESTORE NORMALIZE
           * ---------------------------------
           */

          const firebaseScripture =
            normalizeStringArray(
              data.scripture
            );


          const firebaseBookSections =
            normalizeBookSections(
              data.bookSections
            );


          const firebaseRelations =
            normalizeRelations(
              data.relations
            );


          /*
           * ---------------------------------
           * MERGED DETAIL
           *
           * 우선순위:
           *
           * 1. Firestore
           * 2. data/content.ts
           * 3. 기본값
           * ---------------------------------
           */

          const mergedBookSections =
            mergeBookSections(
              firebaseBookSections,
              localBookSections
            );


          const mergedRelations =
            mergeRelations(
              firebaseRelations,
              localRelations
            );


          const mergedScripture =
            firebaseScripture.length >
            0
              ? firebaseScripture
              : localScripture;


          /*
           * NORMALIZED BOOK
           */

          const firebaseBook:
            BibleBook = {

            slug:
              data.slug,


            titleKo:
              hasText(
                data.titleKo
              )
                ? data.titleKo
                : localNode?.titleKo ??
                  "",


            titleEn:
              hasText(
                data.titleEn
              )
                ? data.titleEn
                : localNode?.titleEn ??
                  "",


            eyebrow:
              hasText(
                data.eyebrow
              )
                ? data.eyebrow
                : localNode?.eyebrow ??
                  "BIBLE",


            summary:
              hasText(
                data.summary
              )
                ? data.summary
                : localNode?.summary ??
                  "",


            heroImage:
              hasText(
                data.heroImage
              )
                ? data.heroImage
                : localNode?.heroImage ??
                  "/assets/scraptura-home-clean.jpg",


            overview:
              hasText(
                data.overview
              )
                ? data.overview
                : localNode?.overview &&
                  localNode.overview.trim()
                    ? localNode.overview
                    : undefined,


            biblicalContext:
              hasText(
                data.biblicalContext
              )
                ? data.biblicalContext
                : localNode?.biblicalContext &&
                  localNode.biblicalContext.trim()
                    ? localNode.biblicalContext
                    : undefined,


            scripture:
              mergedScripture,


            bookSections:
              mergedBookSections,


            relations:
              mergedRelations,

          };


          /*
           * 개발 중 어떤 데이터가
           * fallback 되었는지 확인용
           */

          if (
            process.env.NODE_ENV ===
            "development"
          ) {

            console.info(
              "[SCRAPTURA Bible Detail]",
              {
                slug,

                source:
                  "Firestore + local fallback",

                firestore: {
                  overview:
                    hasText(
                      data.overview
                    ),

                  biblicalContext:
                    hasText(
                      data.biblicalContext
                    ),

                  bookSections:
                    firebaseBookSections.length,

                  scripture:
                    firebaseScripture.length,

                  relations:
                    firebaseRelations.length,
                },

                local: {
                  found:
                    Boolean(
                      localNode
                    ),

                  bookSections:
                    localBookSections.length,

                  scripture:
                    localScripture.length,

                  relations:
                    localRelations.length,
                },

                merged: {
                  bookSections:
                    mergedBookSections.length,

                  scripture:
                    mergedScripture.length,

                  relations:
                    mergedRelations.length,
                },
              }
            );

          }


          if (
            !cancelled
          ) {

            setBook(
              firebaseBook
            );

          }

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

            setBook(
              null
            );


            setErrorMessage(
              "성경 콘텐츠를 불러오지 못했습니다."
            );

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
  ]);


  /*
   * =====================================
   * LOADING
   * =====================================
   */

  if (
    loading
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


  /*
   * =====================================
   * ERROR
   * =====================================
   */

  if (
    errorMessage
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


  /*
   * =====================================
   * NOT FOUND
   * =====================================
   */

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
            아직 공개되지 않았거나
            존재하지 않는 콘텐츠입니다.
          </p>

        </section>

      </main>
    );

  }


  /*
   * =====================================
   * CONTENT
   * =====================================
   */

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


      <div className="contentWrap">

        {/* OVERVIEW */}

        <section className="overview">

          <small>
            OVERVIEW
          </small>


          <h3>
            {book.titleKo} 탐험
          </h3>


          <p>
            {book.overview ??
              book.summary}
          </p>

        </section>


        {/* BIBLICAL CONTEXT */}

        {book.biblicalContext && (

          <section className="journey">

            <small>
              BIBLICAL CONTEXT
            </small>


            <h3>
              책의 흐름과 배경
            </h3>


            <p>
              {book.biblicalContext}
            </p>

          </section>

        )}


        {/* BOOK JOURNEY */}

        {book.bookSections.length >
          0 && (

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
                {book.titleKo}의 주요 흐름
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

              {book.bookSections.map(
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
                      {section.number}
                    </div>


                    <div
                      className=
                        "characterStageContent"
                    >

                      <small>
                        {section.scripture}
                      </small>


                      <h4>
                        {section.title}
                      </h4>


                      <p>
                        {section.description}
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )}


        {/* SCRIPTURE */}

        {book.scripture.length >
          0 && (

          <section className="journey">

            <small>
              SCRIPTURE
            </small>


            <h3>
              본문 범위
            </h3>


            <p>
              {book.scripture.join(
                " · "
              )}
            </p>

          </section>

        )}


        {/* RELATED CONTENT */}

        {book.relations.length >
          0 && (

          <RelationCards
            items={
              book.relations
            }
          />

        )}

      </div>

    </main>
  );
}