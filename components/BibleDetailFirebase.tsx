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
           * 일반 사용자는
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
           * SCRIPTURE
           */

          const scripture =
            Array.isArray(
              data.scripture
            )
              ? data.scripture
                  .filter(
                    (
                      item
                    ):
                      item is string =>
                        typeof item ===
                        "string"
                  )
              : [];


          /*
           * NORMALIZED BOOK
           */

          const firebaseBook:
            BibleBook = {

            slug:
              data.slug,

            titleKo:
              data.titleKo,

            titleEn:
              data.titleEn,

            eyebrow:
              typeof data.eyebrow ===
              "string"
                ? data.eyebrow
                : "BIBLE",

            summary:
              data.summary,

            heroImage:
              typeof data.heroImage ===
                "string" &&
              data.heroImage.trim()
                ? data.heroImage
                : "/assets/scraptura-home-clean.jpg",

            overview:
              typeof data.overview ===
                "string" &&
              data.overview.trim()
                ? data.overview
                : undefined,

            biblicalContext:
              typeof data.biblicalContext ===
                "string" &&
              data.biblicalContext.trim()
                ? data.biblicalContext
                : undefined,

            scripture,

            bookSections:
              normalizeBookSections(
                data.bookSections
              ),

            relations:
              normalizeRelations(
                data.relations
              ),
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