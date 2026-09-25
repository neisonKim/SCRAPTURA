"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  db,
} from "../lib/firebase";


type BibleBook = {
  slug: string;

  titleKo: string;
  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  order: number;
};


export default function BibleArchiveFirebase() {

  const [
    books,
    setBooks,
  ] =
    useState<BibleBook[]>([]);


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
   * FIRESTORE BIBLE LOAD
   * =====================================
   */

  useEffect(() => {

    let cancelled =
      false;


    const loadBooks =
      async () => {

        try {

          setLoading(
            true
          );

          setErrorMessage(
            ""
          );


          /*
           * Firestore Rules에 맞춰
           * published만 조회
           */

          const publicQuery =
            query(
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
              publicQuery
            );


          if (
            cancelled
          ) {
            return;
          }


          const firebaseBooks:
            BibleBook[] = [];


          snapshot.forEach(
            (
              contentDocument
            ) => {

              const data =
                contentDocument.data();


              /*
               * BIBLE만
               */
              if (
                data.type !==
                "book"
              ) {
                return;
              }


              /*
               * 필수 필드
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
                return;
              }


              firebaseBooks.push({
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

                order:
                  typeof data.order ===
                  "number"
                    ? data.order
                    : 9999,
              });

            }
          );


          /*
           * 성경 순서
           * Genesis 1 → Revelation 66
           */

          firebaseBooks.sort(
            (
              a,
              b
            ) =>
              a.order -
              b.order
          );


          setBooks(
            firebaseBooks
          );

        } catch (
          error
        ) {

          console.error(
            "BIBLE Firestore load error:",
            error
          );


          if (
            !cancelled
          ) {

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


    loadBooks();


    return () => {

      cancelled =
        true;

    };

  }, []);


  /*
   * =====================================
   * FEATURED
   * =====================================
   *
   * 기존 디자인 유지를 위해
   * 사무엘상을 대표 콘텐츠로 사용.
   *
   * 이제 사무엘상도 Firestore 데이터.
   */

  const featured =
    books.find(
      (
        book
      ) =>
        book.slug ===
        "1-samuel"
    ) ??
    books[0];


  const rest =
    featured
      ? books.filter(
          (
            book
          ) =>
            book.slug !==
            featured.slug
        )
      : [];


  /*
   * =====================================
   * LOADING
   * =====================================
   */

  if (
    loading
  ) {

    return (
      <main>

        <section className="pageHead">

          <small>
            SCRAPTURA ARCHIVE
          </small>

          <h1>
            BIBLE
          </h1>

          <p>
            성경 콘텐츠를 불러오고 있습니다.
          </p>

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
      <main>

        <section className="pageHead">

          <small>
            BIBLE
          </small>

          <h1>
            BIBLE
          </h1>

          <p>
            {errorMessage}
          </p>

        </section>

      </main>
    );

  }


  /*
   * =====================================
   * EMPTY
   * =====================================
   */

  if (
    books.length ===
    0
  ) {

    return (
      <main>

        <section className="pageHead">

          <small>
            BIBLE
          </small>

          <h1>
            BIBLE
          </h1>

          <p>
            공개된 성경 콘텐츠가 없습니다.
          </p>

        </section>

      </main>
    );

  }


  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <main>

      <section className="pageHead">

        <small>
          SCRAPTURA ARCHIVE
        </small>


        <h1>
          BIBLE
        </h1>


        <p>
          성경의 책을 중심으로 인물,
          장소, 시대와 이야기를 연결하며
          본문의 흐름을 탐험하세요.
        </p>

      </section>


      <section className="bibleArchive">

        <div className="bibleSectionHead">

          <small>
            EXPLORE SCRIPTURE
          </small>


          <h2>
            성경의 책에서 인물과 사건의
            세계로 들어가세요
          </h2>


          <p>
            구약 39권과 신약 27권을 따라
            성경의 인물, 장소, 시대와
            이야기를 연결합니다.
          </p>

        </div>


        {/* FEATURED */}

        {featured && (

          <Link
            className="bibleFeatured"

            href={
              `/bible/${featured.slug}`
            }
          >

            <div
              className=
                "bibleFeaturedImage"

              style={{
                backgroundImage:
                  `url("${featured.heroImage}")`,
              }}
            >

              <div
                className=
                  "bibleFeaturedShade"
              />

            </div>


            <div
              className=
                "bibleFeaturedContent"
            >

              <small>
                {featured.eyebrow}
              </small>


              <h2>
                {featured.titleKo}
              </h2>


              <b>
                {featured.titleEn}
              </b>


              <p>
                {featured.summary}
              </p>


              <div className="biblePath">

                <span>
                  BOOK
                </span>

                <i>
                  →
                </i>

                <span>
                  PEOPLE
                </span>

                <i>
                  →
                </i>

                <span>
                  PLACES
                </span>

                <i>
                  →
                </i>

                <span>
                  STORIES
                </span>

              </div>


              <strong>
                EXPLORE BOOK →
              </strong>

            </div>

          </Link>

        )}


        {/* 66 BOOK GRID */}

        {rest.length >
          0 && (

          <div className="bibleBookGrid">

            {rest.map(
              (
                book
              ) => (

                <Link
                  className=
                    "bibleBookCard"

                  key={
                    book.slug
                  }

                  href={
                    `/bible/${book.slug}`
                  }
                >

                  <div
                    className=
                      "bibleBookImage"

                    style={{
                      backgroundImage:
                        `url("${book.heroImage}")`,
                    }}
                  />


                  <div>

                    <small>
                      {book.eyebrow}
                    </small>


                    <h3>
                      {book.titleKo}
                    </h3>


                    <b>
                      {book.titleEn}
                    </b>


                    <p>
                      {book.summary}
                    </p>


                    <span>
                      EXPLORE BOOK →
                    </span>

                  </div>

                </Link>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}