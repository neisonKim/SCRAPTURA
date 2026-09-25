"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../../../lib/firebase";

import styles from "./page.module.css";


type BibleRow = {
  id: string;
  slug: string;
  titleKo: string;
  titleEn: string;
  status: string;
  order: number;
};


type OperatorData = {
  active?: boolean;
  role?: string;
};


export default function BiblePublishPage() {
  const router =
    useRouter();


  const [
    books,
    setBooks,
  ] =
    useState<BibleRow[]>([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    publishing,
    setPublishing,
  ] =
    useState(false);


  const [
    message,
    setMessage,
  ] =
    useState("");


  /*
   * =====================================
   * LOAD BIBLE BOOKS
   * =====================================
   */

  const loadBooks =
    async () => {

      setMessage("");

      const snapshot =
        await getDocs(
          collection(
            db,
            "contents"
          )
        );


      const result:
        BibleRow[] =
        snapshot.docs
          .map(
            (
              documentSnapshot
            ) => {

              const data =
                documentSnapshot.data();


              return {
                id:
                  documentSnapshot.id,

                slug:
                  typeof data.slug ===
                  "string"
                    ? data.slug
                    : "",

                titleKo:
                  typeof data.titleKo ===
                  "string"
                    ? data.titleKo
                    : "",

                titleEn:
                  typeof data.titleEn ===
                  "string"
                    ? data.titleEn
                    : "",

                status:
                  typeof data.status ===
                  "string"
                    ? data.status
                    : "draft",

                order:
                  typeof data.order ===
                  "number"
                    ? data.order
                    : 9999,

                type:
                  data.type,
              };
            }
          )
          .filter(
            (
              item
            ) => {

              /*
               * 실제 성경 Seed만 사용합니다.
               *
               * 1 ~ 66:
               * 성경 정렬 번호
               *
               * 9:
               * 기존 사무엘상
               *
               * 99:
               * 테스트 데이터
               */

              const raw =
                snapshot.docs.find(
                  (
                    documentSnapshot
                  ) =>
                    documentSnapshot.id ===
                    item.id
                )?.data();


              return (
                raw?.type ===
                  "book" &&

                item.order >=
                  1 &&

                item.order <=
                  66 &&

                item.slug !==
                  "1-samuel"
              );
            }
          )
          .map(
            (
              item
            ) => ({
              id:
                item.id,

              slug:
                item.slug,

              titleKo:
                item.titleKo,

              titleEn:
                item.titleEn,

              status:
                item.status,

              order:
                item.order,
            })
          )
          .sort(
            (
              a,
              b
            ) =>
              a.order -
              b.order
          );


      setBooks(
        result
      );
    };


  /*
   * =====================================
   * AUTH
   * =====================================
   */

  useEffect(() => {

    let cancelled =
      false;


    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          user
        ) => {

          if (
            !user?.email
          ) {

            router.replace(
              "/admin/login"
            );

            return;
          }


          try {

            const email =
              user.email.toLowerCase();


            const operatorSnapshot =
              await getDoc(
                doc(
                  db,
                  "operators",
                  email
                )
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
              operatorSnapshot.data() as
                OperatorData;


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


            await loadBooks();


            if (
              !cancelled
            ) {

              setLoading(
                false
              );

            }

          } catch (
            error
          ) {

            console.error(
              "BIBLE publish page error:",
              error
            );


            if (
              !cancelled
            ) {

              setMessage(
                "성경 데이터를 불러오지 못했습니다."
              );

              setLoading(
                false
              );

            }

          }

        }
      );


    return () => {

      cancelled =
        true;

      unsubscribe();

    };

  }, [
    router,
  ]);


  /*
   * =====================================
   * STATUS COUNTS
   * =====================================
   */

  const statistics =
    useMemo(
      () => {

        const published =
          books.filter(
            (
              book
            ) =>
              book.status ===
              "published"
          ).length;


        const draft =
          books.filter(
            (
              book
            ) =>
              book.status !==
              "published"
          ).length;


        return {
          total:
            books.length,

          published,

          draft,
        };

      },
      [
        books,
      ]
    );


  /*
   * =====================================
   * PUBLISH ALL
   * =====================================
   */

  const publishAllBibleBooks =
    async () => {

      const targetBooks =
        books.filter(
          (
            book
          ) =>
            book.status !==
            "published"
        );


      if (
        targetBooks.length ===
        0
      ) {

        setMessage(
          "이미 모든 성경책이 공개 상태입니다."
        );

        return;
      }


      const confirmed =
        window.confirm(
          `${targetBooks.length}권의 성경 콘텐츠를 공개 상태로 변경하시겠습니까?`
        );


      if (
        !confirmed
      ) {
        return;
      }


      setPublishing(
        true
      );

      setMessage(
        ""
      );


      try {

        /*
         * Firestore batch 최대 500개.
         * 현재 대상은 최대 65개이므로
         * 한 번의 batch로 충분합니다.
         */

        const batch =
          writeBatch(
            db
          );


        targetBooks.forEach(
          (
            book
          ) => {

            const reference =
              doc(
                db,
                "contents",
                book.id
              );


            batch.update(
              reference,
              {
                status:
                  "published",

                updatedAt:
                  serverTimestamp(),
              }
            );

          }
        );


        await batch.commit();


        await loadBooks();


        setMessage(
          `${targetBooks.length}권을 공개 상태로 변경했습니다.`
        );

      } catch (
        error
      ) {

        console.error(
          "BIBLE bulk publish error:",
          error
        );


        setMessage(
          "일괄 공개 중 오류가 발생했습니다. Firestore 권한을 확인해주세요."
        );

      } finally {

        setPublishing(
          false
        );

      }

    };


  /*
   * =====================================
   * LOADING
   * =====================================
   */

  if (
    loading
  ) {

    return (
      <main
        className={
          styles.page
        }
      >

        <div
          className={
            styles.container
          }
        >

          <p
            className={
              styles.loading
            }
          >
            성경 데이터를 불러오고 있습니다.
          </p>

        </div>

      </main>
    );
  }


  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <main
      className={
        styles.page
      }
    >

      <div
        className={
          styles.container
        }
      >

        <div
          className={
            styles.backRow
          }
        >

          <Link
            href=
              "/admin/contents"
          >
            ← CONTENTS
          </Link>

        </div>


        <header
          className={
            styles.header
          }
        >

          <small>
            BIBLE MANAGEMENT
          </small>

          <h1>
            성경 66권 공개 관리
          </h1>

          <p>
            SCRAPTURA에 등록된
            성경 콘텐츠의 공개 상태를
            관리합니다.
          </p>

        </header>


        <section
          className={
            styles.stats
          }
        >

          <article>
            <small>
              FIRESTORE BOOKS
            </small>

            <strong>
              {statistics.total}
            </strong>

            <span>
              사무엘상 제외
            </span>
          </article>


          <article>
            <small>
              PUBLISHED
            </small>

            <strong>
              {statistics.published}
            </strong>

            <span>
              공개됨
            </span>
          </article>


          <article>
            <small>
              DRAFT
            </small>

            <strong>
              {statistics.draft}
            </strong>

            <span>
              공개 대기
            </span>
          </article>

        </section>


        <section
          className={
            styles.actionSection
          }
        >

          <div>

            <small>
              BULK ACTION
            </small>

            <h2>
              성경 65권 일괄 공개
            </h2>

            <p>
              order 1~66에 포함된
              실제 성경책만 대상으로 합니다.
              기존 사무엘상과 테스트 콘텐츠는
              제외됩니다.
            </p>

          </div>


          <button
            type="button"

            disabled={
              publishing ||
              statistics.draft ===
                0
            }

            onClick={
              publishAllBibleBooks
            }
          >

            {publishing
              ? "공개 처리 중..."
              : `65권 공개하기`}
          </button>

        </section>


        {message && (

          <div
            className={
              styles.message
            }
          >
            {message}
          </div>

        )}


        <section
          className={
            styles.tableSection
          }
        >

          <div
            className={
              styles.tableHead
            }
          >

            <small>
              BIBLE CONTENT
            </small>

            <h2>
              등록된 성경책
            </h2>

          </div>


          <div
            className={
              styles.table
            }
          >

            {books.map(
              (
                book
              ) => (

                <div
                  className={
                    styles.row
                  }

                  key={
                    book.id
                  }
                >

                  <span
                    className={
                      styles.order
                    }
                  >
                    {String(
                      book.order
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>


                  <div
                    className={
                      styles.book
                    }
                  >

                    <strong>
                      {book.titleKo}
                    </strong>

                    <span>
                      {book.titleEn}
                    </span>

                  </div>


                  <span
                    className={
                      book.status ===
                      "published"
                        ? styles.published
                        : styles.draft
                    }
                  >

                    {book.status ===
                    "published"
                      ? "PUBLISHED"
                      : "DRAFT"}

                  </span>


                  <Link
                    className={
                      styles.edit
                    }

                    href={
                      `/admin/contents/${book.id}/edit`
                    }
                  >
                    EDIT
                  </Link>

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}