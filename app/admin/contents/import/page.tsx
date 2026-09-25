"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../../../lib/firebase";

import styles from "./page.module.css";


/* =====================================================
   RELATION TYPES
   ===================================================== */

type ImportRelation = {
  targetType:
    | "story"
    | "person"
    | "place"
    | "period"
    | "book"
    | "visual";

  targetSlug: string;

  relationType:
    | "RELATED_PERSON"
    | "RELATED_PLACE"
    | "RELATED_PERIOD"
    | "RELATED_BOOK"
    | "RELATED_STORY";

  label: string;
};


/* =====================================================
   IMPORT ITEM
   ===================================================== */

type ImportItem = {
  type: string;

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow?: string;

  summary: string;

  heroImage?: string;

  status?: string;

  order?: number;


  /* BIBLE DETAIL */

  overview?: string;

  biblicalContext?: string;

  scripture?: string[];


  bookSections?: Array<{
    number: string;
    title: string;
    scripture: string;
    description: string;
  }>;


  /* RELATIONS */

  relations?: ImportRelation[];


  /* BIBLE CLASSIFICATION */

  testament?: string;

  category?: string;

  categoryKo?: string;

  chapterCount?: number;
};


/* =====================================================
   ALLOWED RELATION VALUES
   ===================================================== */

const CONTENT_TYPE_SET =
  new Set<string>([
    "story",
    "person",
    "place",
    "period",
    "book",
    "visual",
  ]);


const RELATION_TYPE_SET =
  new Set<string>([
    "RELATED_PERSON",
    "RELATED_PLACE",
    "RELATED_PERIOD",
    "RELATED_BOOK",
    "RELATED_STORY",
  ]);


/* =====================================================
   BASE ITEM VALIDATION
   ===================================================== */

function isValidItem(
  item: unknown
): item is ImportItem {

  if (
    typeof item !== "object" ||
    item === null
  ) {
    return false;
  }


  const data =
    item as Record<
      string,
      unknown
    >;


  return (
    typeof data.type ===
      "string" &&

    typeof data.slug ===
      "string" &&

    typeof data.titleKo ===
      "string" &&

    typeof data.titleEn ===
      "string" &&

    typeof data.summary ===
      "string"
  );
}


/* =====================================================
   RELATION VALIDATION
   ===================================================== */

function normalizeRelations(
  value: unknown,
  itemIndex: number
):
  | ImportRelation[]
  | undefined {

  /*
   * relations 자체가 없으면
   * 기존 Firestore relations를
   * 건드리지 않습니다.
   */
  if (
    value === undefined
  ) {
    return undefined;
  }


  if (
    !Array.isArray(
      value
    )
  ) {
    throw new Error(
      `${itemIndex + 1}번째 콘텐츠의 relations는 배열이어야 합니다.`
    );
  }


  return value.map(
    (
      relation,
      relationIndex
    ) => {

      if (
        typeof relation !==
          "object" ||
        relation === null
      ) {
        throw new Error(
          `${itemIndex + 1}번째 콘텐츠의 ${
            relationIndex + 1
          }번째 relation 형식이 올바르지 않습니다.`
        );
      }


      const data =
        relation as Record<
          string,
          unknown
        >;


      const targetType =
        data.targetType;


      const targetSlug =
        data.targetSlug;


      const relationType =
        data.relationType;


      const label =
        data.label;


      /*
       * TARGET TYPE
       */
      if (
        typeof targetType !==
          "string" ||
        !CONTENT_TYPE_SET.has(
          targetType
        )
      ) {
        throw new Error(
          `${itemIndex + 1}번째 콘텐츠의 ${
            relationIndex + 1
          }번째 targetType이 올바르지 않습니다.`
        );
      }


      /*
       * TARGET SLUG
       */
      if (
        typeof targetSlug !==
          "string" ||
        !targetSlug.trim()
      ) {
        throw new Error(
          `${itemIndex + 1}번째 콘텐츠의 ${
            relationIndex + 1
          }번째 targetSlug가 비어 있습니다.`
        );
      }


      /*
       * RELATION TYPE
       */
      if (
        typeof relationType !==
          "string" ||
        !RELATION_TYPE_SET.has(
          relationType
        )
      ) {
        throw new Error(
          `${itemIndex + 1}번째 콘텐츠의 ${
            relationIndex + 1
          }번째 relationType이 올바르지 않습니다.`
        );
      }


      /*
       * LABEL
       */
      if (
        typeof label !==
          "string" ||
        !label.trim()
      ) {
        throw new Error(
          `${itemIndex + 1}번째 콘텐츠의 ${
            relationIndex + 1
          }번째 label이 비어 있습니다.`
        );
      }


      return {
        targetType:
          targetType as
            ImportRelation["targetType"],

        targetSlug:
          targetSlug
            .trim()
            .toLowerCase(),

        relationType:
          relationType as
            ImportRelation["relationType"],

        label:
          label.trim(),
      };
    }
  );
}


/* =====================================================
   DOCUMENT ID
   ===================================================== */

function makeDocumentId(
  type: string,
  slug: string
) {

  return `${type}__${slug}`
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]/g,
      "-"
    );
}


/* =====================================================
   PAGE
   ===================================================== */

export default function ContentImportPage() {

  const router =
    useRouter();


  const [
    authLoading,
    setAuthLoading,
  ] =
    useState(true);


  const [
    importing,
    setImporting,
  ] =
    useState(false);


  const [
    jsonText,
    setJsonText,
  ] =
    useState("");


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    errorMessage,
    setErrorMessage,
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

            /*
             * operators 문서 ID가
             * 이메일 기준이므로
             * 소문자로 정규화합니다.
             */

            const email =
              user.email
                .trim()
                .toLowerCase();


            const operatorRef =
              doc(
                db,
                "operators",
                email
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
              "Import admin check error:",
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
     IMPORT
     ===================================================== */

  const handleImport =
    async () => {

      setMessage(
        ""
      );


      setErrorMessage(
        ""
      );


      if (
        !jsonText.trim()
      ) {

        setErrorMessage(
          "JSON 데이터를 입력하세요."
        );

        return;
      }


      try {

        setImporting(
          true
        );


        /*
         * JSON PARSE
         */

        const parsed:
          unknown =
          JSON.parse(
            jsonText
          );


        if (
          !Array.isArray(
            parsed
          )
        ) {

          throw new Error(
            "최상위 JSON은 배열이어야 합니다."
          );

        }


        if (
          parsed.length ===
          0
        ) {

          throw new Error(
            "등록할 콘텐츠가 없습니다."
          );

        }


        /*
         * Firestore Batch는
         * 최대 500 operations.
         *
         * 안전하게 기존 정책인
         * 400개 제한 유지.
         */

        if (
          parsed.length >
          400
        ) {

          throw new Error(
            "한 번에 최대 400개까지만 등록하세요."
          );

        }


        /*
         * 필수 필드 확인
         */

        const invalidIndex =
          parsed.findIndex(
            (
              item
            ) =>
              !isValidItem(
                item
              )
          );


        if (
          invalidIndex !==
          -1
        ) {

          throw new Error(
            `${invalidIndex + 1}번째 콘텐츠의 필수 필드를 확인하세요.`
          );

        }


        /*
         * =====================================
         * NORMALIZE ITEMS
         * =====================================
         */

        const normalizedItems =
          parsed.map(
            (
              rawItem,
              index
            ) => {

              if (
                !isValidItem(
                  rawItem
                )
              ) {

                throw new Error(
                  `${index + 1}번째 콘텐츠 형식이 올바르지 않습니다.`
                );

              }


              const normalizedSlug =
                rawItem.slug
                  .trim()
                  .toLowerCase();


              if (
                !normalizedSlug
              ) {

                throw new Error(
                  `${index + 1}번째 콘텐츠의 slug가 비어 있습니다.`
                );

              }


              const normalizedType =
                rawItem.type
                  .trim()
                  .toLowerCase();


              if (
                !normalizedType
              ) {

                throw new Error(
                  `${index + 1}번째 콘텐츠의 type이 비어 있습니다.`
                );

              }


              /*
               * relations 검증 및 정규화
               */

              const normalizedRelations =
                normalizeRelations(
                  rawItem.relations,
                  index
                );


              return {
                item:
                  rawItem,

                normalizedSlug,

                normalizedType,

                normalizedRelations,
              };
            }
          );


        /*
         * =====================================
         * DUPLICATE TYPE + SLUG CHECK
         * =====================================
         */

        const ids =
          normalizedItems.map(
            (
              entry
            ) =>
              makeDocumentId(
                entry.normalizedType,
                entry.normalizedSlug
              )
          );


        const uniqueIds =
          new Set(
            ids
          );


        if (
          uniqueIds.size !==
          ids.length
        ) {

          throw new Error(
            "JSON 안에 중복된 type + slug가 있습니다."
          );

        }


        /*
         * =====================================
         * BATCH WRITE
         * =====================================
         */

        const batch =
          writeBatch(
            db
          );


        normalizedItems.forEach(
          (
            entry,
            index
          ) => {

            const {
              item,
              normalizedSlug,
              normalizedType,
              normalizedRelations,
            } =
              entry;


            const documentId =
              makeDocumentId(
                normalizedType,
                normalizedSlug
              );


            const contentRef =
              doc(
                db,
                "contents",
                documentId
              );


            /*
             * relations가 JSON에
             * 명시된 경우에만 저장합니다.
             *
             * relations가 생략되면
             * merge:true 때문에
             * 기존 Firestore relations가
             * 그대로 유지됩니다.
             */

            const relationPayload =
              normalizedRelations !==
              undefined
                ? {
                    relations:
                      normalizedRelations,
                  }
                : {};


            batch.set(
              contentRef,
              {
                ...item,

                type:
                  normalizedType,

                slug:
                  normalizedSlug,

                titleKo:
                  item.titleKo.trim(),

                titleEn:
                  item.titleEn.trim(),

                summary:
                  item.summary.trim(),

                eyebrow:
                  typeof item.eyebrow ===
                  "string"
                    ? item.eyebrow.trim()
                    : "",

                heroImage:
                  typeof item.heroImage ===
                  "string"
                    ? item.heroImage.trim()
                    : "",

                status:
                  item.status ??
                  "draft",

                order:
                  typeof item.order ===
                  "number"
                    ? item.order
                    : index + 1,

                /*
                 * 선택 필드는
                 * 존재할 때만 정규화
                 */

                ...(typeof item.overview ===
                "string"
                  ? {
                      overview:
                        item.overview.trim(),
                    }
                  : {}),

                ...(typeof item.biblicalContext ===
                "string"
                  ? {
                      biblicalContext:
                        item.biblicalContext.trim(),
                    }
                  : {}),

                ...(Array.isArray(
                  item.scripture
                )
                  ? {
                      scripture:
                        item.scripture
                          .filter(
                            (
                              value
                            ) =>
                              typeof value ===
                              "string"
                          )
                          .map(
                            (
                              value
                            ) =>
                              value.trim()
                          )
                          .filter(
                            Boolean
                          ),
                    }
                  : {}),

                ...(Array.isArray(
                  item.bookSections
                )
                  ? {
                      bookSections:
                        item.bookSections,
                    }
                  : {}),

                /*
                 * RELATIONS
                 */

                ...relationPayload,

                /*
                 * BIBLE CLASSIFICATION
                 */

                ...(typeof item.testament ===
                "string"
                  ? {
                      testament:
                        item.testament,
                    }
                  : {}),

                ...(typeof item.category ===
                "string"
                  ? {
                      category:
                        item.category,
                    }
                  : {}),

                ...(typeof item.categoryKo ===
                "string"
                  ? {
                      categoryKo:
                        item.categoryKo,
                    }
                  : {}),

                ...(typeof item.chapterCount ===
                "number"
                  ? {
                      chapterCount:
                        item.chapterCount,
                    }
                  : {}),

                createdAt:
                  serverTimestamp(),

                updatedAt:
                  serverTimestamp(),
              },

              {
                merge:
                  true,
              }
            );

          }
        );


        /*
         * FIRESTORE COMMIT
         */

        await batch.commit();


        setMessage(
          `${parsed.length}개의 콘텐츠를 등록했습니다.`
        );


        setTimeout(
          () => {

            router.push(
              "/admin/contents"
            );

          },
          1000
        );

      } catch (
        error
      ) {

        console.error(
          "JSON Import error:",
          error
        );


        if (
          error instanceof
          Error
        ) {

          setErrorMessage(
            error.message
          );

        } else {

          setErrorMessage(
            "JSON Import에 실패했습니다."
          );

        }

      } finally {

        setImporting(
          false
        );

      }

    };


  /* =====================================================
     AUTH LOADING
     ===================================================== */

  if (
    authLoading
  ) {

    return (
      <main
        className={
          styles.loadingPage
        }
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
      className={
        styles.page
      }
    >

      <div
        className={
          styles.container
        }
      >

        <header
          className={
            styles.header
          }
        >

          <Link
            href="/admin/contents"
            className={
              styles.back
            }
          >
            ← CONTENTS
          </Link>


          <small>
            BULK CONTENT IMPORT
          </small>


          <h1>
            JSON 일괄 등록
          </h1>


          <p>
            여러 개의 SCRAPTURA 콘텐츠를
            한 번에 Firestore에 등록합니다.
          </p>

        </header>


        <section
          className={
            styles.guide
          }
        >

          <small>
            JSON FORMAT
          </small>


          <p>
            최상위 데이터는 반드시
            배열 형식이어야 합니다.
          </p>


          <pre>
{`[
  {
    "type": "book",
    "slug": "1-samuel",
    "titleKo": "사무엘상",
    "titleEn": "1 Samuel",
    "eyebrow": "BIBLE · OLD TESTAMENT",
    "summary": "사무엘상의 요약 설명",
    "status": "published",
    "order": 9,
    "relations": [
      {
        "targetType": "person",
        "targetSlug": "david",
        "relationType": "RELATED_PERSON",
        "label": "다윗"
      }
    ]
  }
]`}
          </pre>

        </section>


        <section
          className={
            styles.editor
          }
        >

          <label
            htmlFor="json"
          >
            IMPORT JSON
          </label>


          <textarea
            id="json"

            value={
              jsonText
            }

            spellCheck={
              false
            }

            placeholder=
              "여기에 JSON 배열을 붙여넣으세요."

            onChange={
              (
                event
              ) =>
                setJsonText(
                  event.target.value
                )
            }
          />

        </section>


        {errorMessage && (

          <div
            className={
              styles.error
            }
          >
            {errorMessage}
          </div>

        )}


        {message && (

          <div
            className={
              styles.success
            }
          >
            {message}
          </div>

        )}


        <div
          className={
            styles.actions
          }
        >

          <Link
            href=
              "/admin/contents"

            className={
              styles.cancel
            }
          >
            취소
          </Link>


          <button
            type="button"

            onClick={
              handleImport
            }

            disabled={
              importing
            }
          >

            {importing
              ? "등록 중..."
              : "JSON 등록"}

          </button>

        </div>

      </div>

    </main>
  );
}