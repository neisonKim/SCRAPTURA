"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query as firestoreQuery,
  where,
} from "firebase/firestore";

import {
  db,
} from "../../lib/firebase";


/*
 * =====================================
 * TYPES
 * =====================================
 */

type ContentType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";


type SearchRecord = {
  id: string;

  type: ContentType;

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  overview: string;

  heroImage: string;

  scripture: string[];

  order: number;
};


/*
 * =====================================
 * ROUTES
 * =====================================
 */

const routeByType:
  Record<
    ContentType,
    string
  > = {

  story:
    "stories",

  person:
    "people",

  place:
    "places",

  period:
    "timeline",

  book:
    "bible",

  visual:
    "visual",

};


const labelByType:
  Record<
    ContentType,
    string
  > = {

  story:
    "STORY",

  person:
    "PERSON",

  place:
    "PLACE",

  period:
    "TIMELINE",

  book:
    "BIBLE",

  visual:
    "VISUAL",

};


const filters:
  Array<{
    label: string;
    value:
      | "all"
      | ContentType;
  }> = [

  {
    label:
      "ALL",

    value:
      "all",
  },

  {
    label:
      "STORIES",

    value:
      "story",
  },

  {
    label:
      "PEOPLE",

    value:
      "person",
  },

  {
    label:
      "PLACES",

    value:
      "place",
  },

  {
    label:
      "TIMELINE",

    value:
      "period",
  },

  {
    label:
      "BIBLE",

    value:
      "book",
  },

  {
    label:
      "VISUAL",

    value:
      "visual",
  },

];


/*
 * =====================================
 * NORMALIZERS
 * =====================================
 */

function normalizeString(
  value: unknown
) {

  return typeof value ===
    "string"
    ? value
    : "";
}


function normalizeNumber(
  value: unknown
) {

  return typeof value ===
    "number"
    ? value
    : 9999;
}


function normalizeStringArray(
  value: unknown
) {

  if (
    !Array.isArray(value)
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
      (item) =>
        item.trim()
    )
    .filter(Boolean);
}


function isContentType(
  value: unknown
): value is ContentType {

  return (
    value === "story" ||
    value === "person" ||
    value === "place" ||
    value === "period" ||
    value === "book" ||
    value === "visual"
  );
}


/*
 * =====================================
 * TYPE SORT
 * =====================================
 */

const typeOrder:
  Record<
    ContentType,
    number
  > = {

  story:
    1,

  person:
    2,

  place:
    3,

  period:
    4,

  book:
    5,

  visual:
    6,

};


/*
 * =====================================
 * PAGE
 * =====================================
 */

export default function SearchPage() {

  const [
    archive,
    setArchive,
  ] =
    useState<SearchRecord[]>(
      []
    );


  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");


  const [
    type,
    setType,
  ] =
    useState<
      "all" |
      ContentType
    >(
      "all"
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
   * LOAD FIRESTORE ARCHIVE
   * =====================================
   */

  useEffect(() => {

    let active = true;


    async function loadArchive() {

      try {

        setLoading(
          true
        );

        setErrorMessage(
          ""
        );


        /*
         * Firestore Security Rules:
         *
         * published 조건을 Query에
         * 반드시 포함합니다.
         */

        const contentsQuery =
          firestoreQuery(

            collection(
              db,
              "contents"
            ),

            where(
              "status",
              "==",
              "published"
            )

          );


        const snapshot =
          await getDocs(
            contentsQuery
          );


        if (!active) {
          return;
        }


        const records =
          snapshot.docs

            .map(
              (
                document
              ):
                SearchRecord |
                null => {

                const data =
                  document.data();


                if (
                  !isContentType(
                    data.type
                  )
                ) {
                  return null;
                }


                const slug =
                  normalizeString(
                    data.slug
                  )
                    .trim()
                    .toLowerCase();


                if (!slug) {
                  return null;
                }


                return {

                  id:
                    document.id,

                  type:
                    data.type,

                  slug,

                  titleKo:
                    normalizeString(
                      data.titleKo
                    ),

                  titleEn:
                    normalizeString(
                      data.titleEn
                    ),

                  eyebrow:
                    normalizeString(
                      data.eyebrow
                    ),

                  summary:
                    normalizeString(
                      data.summary
                    ),

                  overview:
                    normalizeString(
                      data.overview
                    ),

                  heroImage:
                    normalizeString(
                      data.heroImage
                    ),

                  scripture:
                    normalizeStringArray(
                      data.scripture
                    ),

                  order:
                    normalizeNumber(
                      data.order
                    ),

                };
              }
            )

            .filter(
              (
                item
              ): item is SearchRecord =>
                item !== null
            )

            .sort(
              (
                a,
                b
              ) => {

                /*
                 * Type별로 안정적인
                 * 결과 순서를 만듭니다.
                 */

                if (
                  typeOrder[a.type] !==
                  typeOrder[b.type]
                ) {

                  return (
                    typeOrder[a.type] -
                    typeOrder[b.type]
                  );
                }


                if (
                  a.order !==
                  b.order
                ) {

                  return (
                    a.order -
                    b.order
                  );
                }


                return (
                  a.titleKo.localeCompare(
                    b.titleKo,
                    "ko"
                  )
                );
              }
            );


        setArchive(
          records
        );


      } catch (error) {

        console.error(
          "[SearchPage]",
          error
        );


        if (!active) {
          return;
        }


        setErrorMessage(
          "아카이브 데이터를 불러오지 못했습니다."
        );


      } finally {

        if (active) {

          setLoading(
            false
          );

        }
      }
    }


    void loadArchive();


    return () => {

      active = false;

    };

  }, []);


  /*
   * =====================================
   * SEARCH
   * =====================================
   */

  const normalized =
    searchQuery
      .trim()
      .toLocaleLowerCase();


  const results =
    useMemo(
      () => {

        return archive.filter(
          (node) => {

            /*
             * TYPE FILTER
             */

            if (
              type !== "all" &&
              node.type !== type
            ) {
              return false;
            }


            /*
             * 검색어가 없으면
             * 해당 Type 전체 표시
             */

            if (!normalized) {
              return true;
            }


            /*
             * 검색 대상
             *
             * 한글 제목
             * 영문 제목
             * Eyebrow
             * Summary
             * Overview
             * Scripture
             */

            const searchable =
              [

                node.titleKo,

                node.titleEn,

                node.eyebrow,

                node.summary,

                node.overview,

                ...node.scripture,

              ]
                .join(" ")
                .toLocaleLowerCase();


            return (
              searchable.includes(
                normalized
              )
            );

          }
        );

      },
      [
        archive,
        normalized,
        type,
      ]
    );


  /*
   * =====================================
   * RESET
   * =====================================
   */

  function resetSearch() {

    setSearchQuery(
      ""
    );

    setType(
      "all"
    );

  }


  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (

    <main>

      {/* =================================
          PAGE HEADER
      ================================= */}

      <section
        className="pageHead"
      >

        <small>
          SCRAPTURA ARCHIVE
        </small>

        <h1>
          SEARCH
        </h1>

        <p>
          이야기, 인물, 장소, 시대와
          성경 기록을 하나의 아카이브에서
          탐색하세요.
        </p>

      </section>


      {/* =================================
          SEARCH ARCHIVE
      ================================= */}

      <section
        className="searchArchive"
      >

        <div
          className="searchIntro"
        >

          <small>
            EXPLORE THE ARCHIVE
          </small>

          <h2>
            무엇을 찾고 있나요?
          </h2>

          <p>
            한글·영문 제목, 설명 또는
            성경 구절을 검색하면 서로 연결된
            기록으로 바로 이동할 수 있습니다.
          </p>

        </div>


        {/* =================================
            SEARCH BOX
        ================================= */}

        <div
          className="searchBox"
        >

          <span>
            ⌕
          </span>


          <input
            aria-label="SCRAPTURA 통합 검색"
            autoFocus
            onChange={(
              event
            ) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="다윗, 예루살렘, 1 Samuel..."
            type="search"
            value={
              searchQuery
            }
          />


          {searchQuery && (

            <button
              aria-label="검색어 지우기"
              onClick={() =>
                setSearchQuery(
                  ""
                )
              }
              type="button"
            >
              CLEAR
            </button>

          )}

        </div>


        {/* =================================
            FILTERS
        ================================= */}

        <div
          className="searchFilters"
          aria-label="검색 결과 유형"
        >

          {filters.map(
            (
              filter
            ) => (

              <button
                className={
                  type ===
                  filter.value
                    ? "active"
                    : ""
                }
                key={
                  filter.value
                }
                onClick={() =>
                  setType(
                    filter.value
                  )
                }
                type="button"
              >
                {
                  filter.label
                }
              </button>

            )
          )}

        </div>


        {/* =================================
            SEARCH META
        ================================= */}

        <div
          className="searchMeta"
        >

          <span>

            {
              normalized
                ? `"${searchQuery.trim()}"`
                : "ALL ARCHIVE"
            }

          </span>


          <b>

            {
              loading
                ? "LOADING..."
                : `${results.length} RESULTS`
            }

          </b>

        </div>


        {/* =================================
            LOADING
        ================================= */}

        {loading ? (

          <div
            className="searchEmpty"
          >

            <small>
              LOADING ARCHIVE
            </small>

            <h2>
              아카이브를 불러오고 있습니다
            </h2>

            <p>
              Firestore의 공개 콘텐츠를
              준비하고 있습니다.
            </p>

          </div>


        ) : errorMessage ? (

          /*
           * =================================
           * ERROR
           * =================================
           */

          <div
            className="searchEmpty"
          >

            <small>
              SEARCH ERROR
            </small>

            <h2>
              검색 데이터를 불러올 수 없습니다
            </h2>

            <p>
              {errorMessage}
            </p>

          </div>


        ) : results.length > 0 ? (

          /*
           * =================================
           * RESULTS
           * =================================
           */

          <div
            className="searchResults"
          >

            {results.map(
              (
                node
              ) => (

                <Link
                  className="searchResult"
                  href={
                    `/${routeByType[node.type]}/${node.slug}`
                  }
                  key={
                    node.id
                  }
                >

                  <div
                    className="searchResultImage"
                    style={{
                      backgroundImage:
                        `url("${node.heroImage}")`,
                    }}
                  />


                  <div
                    className="searchResultCopy"
                  >

                    <small>
                      {
                        labelByType[
                          node.type
                        ]
                      }
                      {" · "}
                      {
                        node.eyebrow
                      }
                    </small>

                    <h2>
                      {
                        node.titleKo
                      }
                    </h2>

                    <b>
                      {
                        node.titleEn
                      }
                    </b>

                    <p>
                      {
                        node.summary
                      }
                    </p>

                  </div>


                  <span>
                    →
                  </span>

                </Link>

              )
            )}

          </div>


        ) : (

          /*
           * =================================
           * EMPTY
           * =================================
           */

          <div
            className="searchEmpty"
          >

            <small>
              NO RESULTS
            </small>

            <h2>
              일치하는 기록을
              찾지 못했습니다
            </h2>

            <p>
              검색어를 줄이거나 다른 콘텐츠
              유형을 선택해 보세요.
            </p>

            <button
              onClick={
                resetSearch
              }
              type="button"
            >
              RESET SEARCH
            </button>

          </div>

        )}

      </section>

    </main>

  );
}