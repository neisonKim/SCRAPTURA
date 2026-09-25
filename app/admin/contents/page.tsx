"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../../lib/firebase";

import styles
  from "./page.module.css";


/* =====================================================
   TYPES
   ===================================================== */

type ContentStatus =
  | "draft"
  | "review"
  | "published"
  | "hidden";


type VerificationStatus =
  | "not_reviewed"
  | "reviewed"
  | "verified";


type ViewMode =
  | "active"
  | "trash";


type ContentRow = {
  id: string;

  type: string;

  slug: string;

  titleKo: string;

  titleEn: string;

  status:
    ContentStatus;

  verificationStatus:
    VerificationStatus;

  order?: number;

  trashed:
    boolean;
};


/* =====================================================
   CONTENT TYPES
   ===================================================== */

const contentTypes = [
  {
    value: "all",
    label: "전체",
  },

  {
    value: "story",
    label: "STORIES",
  },

  {
    value: "person",
    label: "PEOPLE",
  },

  {
    value: "place",
    label: "PLACES",
  },

  {
    value: "period",
    label: "TIMELINE",
  },

  {
    value: "book",
    label: "BIBLE",
  },

  {
    value: "visual",
    label: "VISUAL",
  },
];


/* =====================================================
   NORMALIZERS
   ===================================================== */

function normalizeStatus(
  value: unknown
): ContentStatus {

  if (
    value === "private" ||
    value === "hidden"
  ) {
    return "hidden";
  }


  if (
    value === "review"
  ) {
    return "review";
  }


  if (
    value === "published"
  ) {
    return "published";
  }


  return "draft";
}


function normalizeVerificationStatus(
  value: unknown
): VerificationStatus {

  if (
    value === "verified"
  ) {
    return "verified";
  }


  if (
    value === "reviewed"
  ) {
    return "reviewed";
  }


  return "not_reviewed";
}


/* =====================================================
   LABELS
   ===================================================== */

function getStatusLabel(
  status:
    ContentStatus
) {

  switch (
    status
  ) {

    case "published":
      return "공개";

    case "review":
      return "검토대기";

    case "hidden":
      return "비공개";

    default:
      return "임시저장";
  }
}


function getVerificationLabel(
  status:
    VerificationStatus
) {

  switch (
    status
  ) {

    case "verified":
      return "검증완료";

    case "reviewed":
      return "검토완료";

    default:
      return "미검토";
  }
}


/* =====================================================
   PAGE WRAPPER
   ===================================================== */

export default function AdminContentsPage() {

  return (
    <Suspense
      fallback={
        <main
          className={
            styles.loadingPage
          }
        >
          콘텐츠를 불러오고 있습니다.
        </main>
      }
    >
      <AdminContentsContent />
    </Suspense>
  );
}


/* =====================================================
   PAGE CONTENT
   ===================================================== */

function AdminContentsContent() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();


  const requestedType =
    searchParams.get(
      "type"
    ) ??
    "all";


  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  const [
    rows,
    setRows,
  ] =
    useState<
      ContentRow[]
    >([]);


  const [
    selectedType,
    setSelectedType,
  ] =
    useState(
      requestedType
    );


  const [
    selectedStatus,
    setSelectedStatus,
  ] =
    useState<
      "all" |
      ContentStatus
    >(
      "all"
    );


  const [
    selectedVerification,
    setSelectedVerification,
  ] =
    useState<
      "all" |
      VerificationStatus
    >(
      "all"
    );


  const [
    viewMode,
    setViewMode,
  ] =
    useState<
      ViewMode
    >(
      "active"
    );


  const [
    keyword,
    setKeyword,
  ] =
    useState("");


  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");


  const [
    actionId,
    setActionId,
  ] =
    useState("");


  /* =====================================================
     URL TYPE SYNC
     ===================================================== */

  useEffect(() => {

    setSelectedType(
      requestedType
    );

  }, [
    requestedType,
  ]);


  /* =====================================================
     AUTH + CONTENT LOAD
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

            /* =========================
               ADMIN CHECK
               ========================= */

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


            /* =========================
               CONTENT LOAD
               ========================= */

            const snapshot =
              await getDocs(
                collection(
                  db,
                  "contents"
                )
              );


            const contentRows:
              ContentRow[] = [];


            snapshot.forEach(
              (
                contentDocument
              ) => {

                const data =
                  contentDocument.data();


                contentRows.push({

                  id:
                    contentDocument.id,

                  type:
                    typeof data.type ===
                      "string"
                      ? data.type
                      : "",

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
                    normalizeStatus(
                      data.status
                    ),

                  verificationStatus:
                    normalizeVerificationStatus(
                      data.verificationStatus
                    ),

                  order:
                    typeof data.order ===
                      "number"
                      ? data.order
                      : 9999,

                  /*
                   * trashedAt 필드가 존재하면
                   * 휴지통 콘텐츠로 취급
                   */

                  trashed:
                    data.trashedAt != null,

                });

              }
            );


            /* =========================
               SORT
               ========================= */

            contentRows.sort(
              (
                a,
                b
              ) => {

                const typeCompare =
                  a.type.localeCompare(
                    b.type
                  );


                if (
                  typeCompare !==
                  0
                ) {
                  return typeCompare;
                }


                return (
                  (
                    a.order ??
                    9999
                  ) -
                  (
                    b.order ??
                    9999
                  )
                );

              }
            );


            setRows(
              contentRows
            );


            setLoading(
              false
            );


          } catch (error) {

            console.error(
              "콘텐츠 목록 로드 오류:",
              error
            );


            setErrorMessage(
              "콘텐츠 목록을 불러오지 못했습니다."
            );


            setLoading(
              false
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
     COUNTS
     ===================================================== */

  const activeCount =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            !row.trashed
        ).length,
      [
        rows,
      ]
    );


  const trashCount =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            row.trashed
        ).length,
      [
        rows,
      ]
    );


  /* =====================================================
     FILTER
     ===================================================== */

  const filteredRows =
    useMemo(
      () => {

        const normalizedKeyword =
          keyword
            .trim()
            .toLowerCase();


        return rows.filter(
          (
            row
          ) => {

            const viewMatch =
              viewMode ===
                "trash"
                ? row.trashed
                : !row.trashed;


            const typeMatch =
              selectedType ===
                "all" ||
              row.type ===
                selectedType;


            const statusMatch =
              selectedStatus ===
                "all" ||
              row.status ===
                selectedStatus;


            const verificationMatch =
              selectedVerification ===
                "all" ||
              row.verificationStatus ===
                selectedVerification;


            const keywordMatch =
              normalizedKeyword ===
                "" ||
              row.titleKo
                .toLowerCase()
                .includes(
                  normalizedKeyword
                ) ||
              row.titleEn
                .toLowerCase()
                .includes(
                  normalizedKeyword
                ) ||
              row.slug
                .toLowerCase()
                .includes(
                  normalizedKeyword
                );


            return (
              viewMatch &&
              typeMatch &&
              statusMatch &&
              verificationMatch &&
              keywordMatch
            );
          }
        );

      },
      [
        rows,
        viewMode,
        selectedType,
        selectedStatus,
        selectedVerification,
        keyword,
      ]
    );


  /* =====================================================
     RESTORE
     ===================================================== */

  const handleRestore =
    async (
      row:
        ContentRow
    ) => {

      if (
        actionId
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          `"${row.titleKo || row.slug}" 콘텐츠를 복원하시겠습니까?\n\n복원 후에는 Draft 상태가 됩니다.`
        );


      if (
        !confirmed
      ) {
        return;
      }


      try {

        setActionId(
          row.id
        );

        setErrorMessage(
          ""
        );


        const contentRef =
          doc(
            db,
            "contents",
            row.id
          );


        await updateDoc(
          contentRef,
          {

            status:
              "draft",

            trashedAt:
              deleteField(),

            updatedAt:
              serverTimestamp(),

          }
        );


        setRows(
          (
            current
          ) =>
            current.map(
              (
                item
              ) =>
                item.id ===
                  row.id
                  ? {
                      ...item,

                      status:
                        "draft",

                      trashed:
                        false,
                    }
                  : item
            )
        );


      } catch (error) {

        console.error(
          "콘텐츠 복원 오류:",
          error
        );


        setErrorMessage(
          "콘텐츠 복원에 실패했습니다."
        );


      } finally {

        setActionId(
          ""
        );

      }
    };


  /* =====================================================
     PERMANENT DELETE
     ===================================================== */

  const handlePermanentDelete =
    async (
      row:
        ContentRow
    ) => {

      if (
        actionId ||
        !row.trashed
      ) {
        return;
      }


      const firstConfirm =
        window.confirm(
          `"${row.titleKo || row.slug}" 콘텐츠를 영구삭제하시겠습니까?\n\nFirestore 문서는 완전히 삭제되며 이 작업은 되돌릴 수 없습니다.`
        );


      if (
        !firstConfirm
      ) {
        return;
      }


      const secondConfirm =
        window.confirm(
          "정말 영구삭제하시겠습니까?\n\n연결된 Relation에서 이 콘텐츠를 참조하고 있을 수 있습니다."
        );


      if (
        !secondConfirm
      ) {
        return;
      }


      try {

        setActionId(
          row.id
        );

        setErrorMessage(
          ""
        );


        await deleteDoc(
          doc(
            db,
            "contents",
            row.id
          )
        );


        setRows(
          (
            current
          ) =>
            current.filter(
              (
                item
              ) =>
                item.id !==
                row.id
            )
        );


      } catch (error) {

        console.error(
          "콘텐츠 영구삭제 오류:",
          error
        );


        setErrorMessage(
          "콘텐츠 영구삭제에 실패했습니다."
        );


      } finally {

        setActionId(
          ""
        );

      }
    };


  /* =====================================================
     LOADING
     ===================================================== */

  if (
    loading
  ) {

    return (
      <main
        className={
          styles.loadingPage
        }
      >
        콘텐츠를 불러오고 있습니다.
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

        {/* =================================
            HEADER
            ================================= */}

        <header
          className={
            styles.header
          }
        >

          <div>

            <Link
              href="/admin"
              className={
                styles.back
              }
            >
              ← ADMIN
            </Link>


            <small>
              CONTENT MANAGEMENT
            </small>


            <h1>
              콘텐츠 관리
            </h1>


            <p>
              SCRAPTURA의 이야기,
              인물, 장소, 시대와
              성경 콘텐츠를 관리합니다.
            </p>

          </div>


          {viewMode ===
            "active" && (

            <Link
              href="/admin/contents/new"
              className={
                styles.newButton
              }
            >
              + 새 콘텐츠
            </Link>

          )}

        </header>


        {/* =================================
            ACTIVE / TRASH
            ================================= */}

        <section
          className={
            styles.toolbar
          }
          style={{
            marginBottom:
              "18px",
          }}
        >

          <div
            className={
              styles.typeFilters
            }
          >

            <button
              type="button"
              className={
                viewMode ===
                  "active"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() => {

                setViewMode(
                  "active"
                );

                setSelectedStatus(
                  "all"
                );

              }}
            >
              콘텐츠 {
                activeCount
              }
            </button>


            <button
              type="button"
              className={
                viewMode ===
                  "trash"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() => {

                setViewMode(
                  "trash"
                );

                setSelectedStatus(
                  "all"
                );

              }}
            >
              휴지통 {
                trashCount
              }
            </button>

          </div>

        </section>


        {/* =================================
            FILTER
            ================================= */}

        <section
          className={
            styles.toolbar
          }
        >

          <div
            className={
              styles.typeFilters
            }
          >

            {contentTypes.map(
              (
                item
              ) => (

                <button
                  type="button"
                  key={
                    item.value
                  }
                  className={
                    selectedType ===
                      item.value
                      ? styles.activeFilter
                      : ""
                  }
                  onClick={() =>
                    setSelectedType(
                      item.value
                    )
                  }
                >
                  {
                    item.label
                  }
                </button>

              )
            )}

          </div>


          <div
            className={
              styles.searchArea
            }
          >

            {/* PUBLICATION STATUS */}

            {viewMode ===
              "active" && (

              <select
                value={
                  selectedStatus
                }
                onChange={
                  (
                    event
                  ) =>
                    setSelectedStatus(
                      event.target.value as
                        | "all"
                        | ContentStatus
                    )
                }
              >

                <option
                  value="all"
                >
                  전체 상태
                </option>

                <option
                  value="draft"
                >
                  Draft · 임시저장
                </option>

                <option
                  value="review"
                >
                  Review · 검토대기
                </option>

                <option
                  value="published"
                >
                  Published · 공개
                </option>

                <option
                  value="hidden"
                >
                  Hidden · 비공개
                </option>

              </select>

            )}


            {/* VERIFICATION */}

            <select
              value={
                selectedVerification
              }
              onChange={
                (
                  event
                ) =>
                  setSelectedVerification(
                    event.target.value as
                      | "all"
                      | VerificationStatus
                  )
              }
            >

              <option
                value="all"
              >
                전체 검증 상태
              </option>

              <option
                value="not_reviewed"
              >
                Not Reviewed · 미검토
              </option>

              <option
                value="reviewed"
              >
                Reviewed · 검토완료
              </option>

              <option
                value="verified"
              >
                Verified · 검증완료
              </option>

            </select>


            {/* SEARCH */}

            <input
              type="search"
              value={
                keyword
              }
              placeholder="제목 또는 Slug 검색"
              onChange={
                (
                  event
                ) =>
                  setKeyword(
                    event.target.value
                  )
              }
            />

          </div>

        </section>


        {/* =================================
            ERROR
            ================================= */}

        {errorMessage && (

          <div
            className={
              styles.error
            }
          >
            {
              errorMessage
            }
          </div>

        )}


        {/* =================================
            TABLE
            ================================= */}

        <section
          className={
            styles.listSection
          }
        >

          <div
            className={
              styles.listHeader
            }
          >

            <span>

              {
                viewMode ===
                  "trash"
                  ? "휴지통"
                  : "콘텐츠"
              }

              {" · "}

              {
                filteredRows.length
              }개

            </span>

          </div>


          {filteredRows.length ===
          0 ? (

            <div
              className={
                styles.empty
              }
            >

              <small>

                {
                  viewMode ===
                    "trash"
                    ? "TRASH IS EMPTY"
                    : "NO CONTENT"
                }

              </small>


              <h2>

                {
                  viewMode ===
                    "trash"
                    ? "휴지통이 비어 있습니다"
                    : "조건에 맞는 콘텐츠가 없습니다"
                }

              </h2>


              <p>

                {
                  viewMode ===
                    "trash"
                    ? "휴지통으로 이동한 콘텐츠가 이곳에 표시됩니다."
                    : "콘텐츠 유형, 상태, 검증 상태 또는 검색어를 변경해보세요."
                }

              </p>

            </div>

          ) : (

            <div
              className={
                styles.table
              }
            >

              <div
                className={
                  styles.tableHead
                }
              >

                <span>
                  상태
                </span>

                <span>
                  유형
                </span>

                <span>
                  제목
                </span>

                <span>
                  SLUG
                </span>

                <span>
                  관리
                </span>

              </div>


              {filteredRows.map(
                (
                  row
                ) => (

                  <div
                    className={
                      styles.row
                    }
                    key={
                      row.id
                    }
                  >

                    {/* STATUS */}

                    <span
                      className={
                        row.status ===
                          "published" &&
                        !row.trashed
                          ? styles.published
                          : styles.draft
                      }
                    >

                      {
                        row.trashed
                          ? "휴지통"
                          : getStatusLabel(
                              row.status
                            )
                      }


                      <small
                        style={{
                          display:
                            "block",

                          marginTop:
                            "4px",

                          fontSize:
                            "10px",

                          lineHeight:
                            1.35,

                          opacity:
                            0.72,

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          getVerificationLabel(
                            row.verificationStatus
                          )
                        }
                      </small>

                    </span>


                    {/* TYPE */}

                    <span>
                      {
                        row.type
                      }
                    </span>


                    {/* TITLE */}

                    <div>

                      <strong>
                        {
                          row.titleKo ||
                          "제목 없음"
                        }
                      </strong>

                      <small>
                        {
                          row.titleEn
                        }
                      </small>

                    </div>


                    {/* SLUG */}

                    <span>
                      {
                        row.slug
                      }
                    </span>


                    {/* ACTION */}

                    {viewMode ===
                      "trash" ? (

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "10px",

                          flexWrap:
                            "wrap",
                        }}
                      >

                        <button
                          type="button"
                          disabled={
                            actionId ===
                            row.id
                          }
                          onClick={() =>
                            handleRestore(
                              row
                            )
                          }
                          style={{
                            border:
                              "0",

                            padding:
                              "0",

                            background:
                              "transparent",

                            color:
                              "#d1b36f",

                            cursor:
                              "pointer",

                            font:
                              "inherit",
                          }}
                        >
                          {
                            actionId ===
                              row.id
                              ? "처리 중..."
                              : "복원"
                          }
                        </button>


                        <button
                          type="button"
                          disabled={
                            actionId ===
                            row.id
                          }
                          onClick={() =>
                            handlePermanentDelete(
                              row
                            )
                          }
                          style={{
                            border:
                              "0",

                            padding:
                              "0",

                            background:
                              "transparent",

                            color:
                              "#d88b82",

                            cursor:
                              "pointer",

                            font:
                              "inherit",
                          }}
                        >
                          영구삭제
                        </button>

                      </div>

                    ) : (

                      <Link
                        href={
                          `/admin/contents/${row.id}/edit`
                        }
                      >
                        수정 →
                      </Link>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}