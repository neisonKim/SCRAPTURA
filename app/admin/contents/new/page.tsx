"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import Link from "next/link";

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

import RelationEditor, {
  type RelationValue,
} from "../../../../components/admin/RelationEditor";

import HeroImageUploader
  from "../../../../components/admin/HeroImageUploader";

import styles
  from "./page.module.css";


export default function NewContentPage() {
  const router =
    useRouter();


  /* =====================================================
     PAGE STATE
     ===================================================== */

  const [
    authLoading,
    setAuthLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");


  /* =====================================================
     COMMON CONTENT FIELDS
     ===================================================== */

  const [
    type,
    setType,
  ] =
    useState("book");

  const [
    titleKo,
    setTitleKo,
  ] =
    useState("");

  const [
    titleEn,
    setTitleEn,
  ] =
    useState("");

  const [
    slug,
    setSlug,
  ] =
    useState("");

  const [
    eyebrow,
    setEyebrow,
  ] =
    useState("");

  const [
    summary,
    setSummary,
  ] =
    useState("");

  const [
    heroImage,
    setHeroImage,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("draft");

  const [
    order,
    setOrder,
  ] =
    useState("1");


  /* =====================================================
     VERIFICATION / SOURCES
     ===================================================== */

  const [
    verificationStatus,
    setVerificationStatus,
  ] =
    useState(
      "not_reviewed"
    );

  const [
    biblicalSource,
    setBiblicalSource,
  ] =
    useState("");

  const [
    historicalSource,
    setHistoricalSource,
  ] =
    useState("");

  const [
    interpretationNote,
    setInterpretationNote,
  ] =
    useState("");

  const [
    visualReconstructionNote,
    setVisualReconstructionNote,
  ] =
    useState("");


  /* =====================================================
     RELATIONS
     ===================================================== */

  const [
    relations,
    setRelations,
  ] =
    useState<
      RelationValue[]
    >([]);


  /* =====================================================
     ADMIN AUTH CHECK
     ===================================================== */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

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
              operator.active !== true ||
              operator.role !== "admin"
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

          } catch (error) {
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
     SAVE CONTENT
     ===================================================== */

  const handleSubmit =
    async (
      event:
        FormEvent<
          HTMLFormElement
        >
    ) => {

      event.preventDefault();

      setErrorMessage("");


      /* =========================
         VALIDATION
         ========================= */

      if (!titleKo.trim()) {
        setErrorMessage(
          "한글 제목을 입력하세요."
        );

        return;
      }


      if (!titleEn.trim()) {
        setErrorMessage(
          "영문 제목을 입력하세요."
        );

        return;
      }


      if (!slug.trim()) {
        setErrorMessage(
          "Slug를 입력하세요."
        );

        return;
      }


      if (!summary.trim()) {
        setErrorMessage(
          "요약 설명을 입력하세요."
        );

        return;
      }


      const normalizedSlug =
        slug
          .trim()
          .toLowerCase();


      /*
       * 공개 상세 페이지가 사용하는
       * 결정형 Firestore 문서 ID
       *
       * story__david-and-goliath
       * person__david
       * place__jerusalem
       * period__rise-of-david
       * book__1-samuel
       * visual__...
       */

      const contentId =
        `${type}__${normalizedSlug}`;


      try {
        setSaving(
          true
        );


        /* =========================
           DUPLICATE CHECK
           ========================= */

        const contentRef =
          doc(
            db,
            "contents",
            contentId
          );


        const existingSnapshot =
          await getDoc(
            contentRef
          );


        if (
          existingSnapshot.exists()
        ) {
          setErrorMessage(
            `이미 같은 유형과 Slug를 사용하는 콘텐츠가 있습니다. (${contentId})`
          );

          return;
        }


        /* =========================
           NORMALIZE RELATIONS
           ========================= */

        const normalizedRelations =
          relations
            .map(
              (relation) => ({
                targetType:
                  relation.targetType,

                targetSlug:
                  relation
                    .targetSlug
                    .trim()
                    .toLowerCase(),

                relationType:
                  relation.relationType,

                label:
                  relation.label
                    .trim(),
              })
            )
            .filter(
              (relation) =>
                relation.targetSlug !==
                  "" &&
                relation.label !==
                  ""
            );


        /* =========================
           REMOVE DUPLICATES
           ========================= */

        const cleanRelations =
          Array.from(
            new Map(
              normalizedRelations.map(
                (relation) => [
                  `${relation.targetType}__${relation.targetSlug}`,
                  relation,
                ]
              )
            ).values()
          );


        /* =========================
           SELF RELATION REMOVE
           ========================= */

        const safeRelations =
          cleanRelations.filter(
            (relation) =>
              !(
                relation.targetType ===
                  type &&
                relation.targetSlug ===
                  normalizedSlug
              )
          );


        /* =========================
           FIRESTORE SAVE
           ========================= */

        await setDoc(
          contentRef,
          {
            type,

            slug:
              normalizedSlug,

            titleKo:
              titleKo.trim(),

            titleEn:
              titleEn.trim(),

            eyebrow:
              eyebrow.trim(),

            summary:
              summary.trim(),

            heroImage:
              heroImage.trim(),

            status,

            order:
              Number(
                order
              ) || 0,

            verificationStatus,

            biblicalSource:
              biblicalSource.trim(),

            historicalSource:
              historicalSource.trim(),

            interpretationNote:
              interpretationNote.trim(),

            visualReconstructionNote:
              visualReconstructionNote.trim(),

            relations:
              safeRelations,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );


        /* =========================
           SUCCESS
           ========================= */

        router.push(
          "/admin/contents"
        );

      } catch (error) {
        console.error(
          "콘텐츠 저장 오류:",
          error
        );

        setErrorMessage(
          "콘텐츠 저장에 실패했습니다."
        );

      } finally {
        setSaving(
          false
        );
      }
    };


  /* =====================================================
     LOADING
     ===================================================== */

  if (authLoading) {
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
     PAGE
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
              href="/admin/contents"
              className={
                styles.back
              }
            >
              ← CONTENTS
            </Link>

            <small>
              CONTENT EDITOR
            </small>

            <h1>
              새 콘텐츠 등록
            </h1>

            <p>
              SCRAPTURA에 새로운 콘텐츠를
              등록합니다.
            </p>

          </div>

        </header>


        <form
          className={
            styles.form
          }
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================
              BASIC INFORMATION
              ================================= */}

          <div
            className={
              styles.sectionHeader
            }
          >
            <small>
              BASIC INFORMATION
            </small>

            <h2>
              기본 정보
            </h2>
          </div>


          {/* TYPE */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="type"
            >
              콘텐츠 유형
            </label>

            <select
              id="type"
              value={
                type
              }
              onChange={
                (event) =>
                  setType(
                    event.target.value
                  )
              }
            >

              <option
                value="story"
              >
                STORIES
              </option>

              <option
                value="person"
              >
                PEOPLE
              </option>

              <option
                value="place"
              >
                PLACES
              </option>

              <option
                value="period"
              >
                TIMELINE
              </option>

              <option
                value="book"
              >
                BIBLE
              </option>

              <option
                value="visual"
              >
                VISUAL
              </option>

            </select>

          </div>


          {/* TITLES */}

          <div
            className={
              styles.twoColumns
            }
          >

            <div
              className={
                styles.field
              }
            >

              <label
                htmlFor="titleKo"
              >
                한글 제목
              </label>

              <input
                id="titleKo"
                type="text"
                value={
                  titleKo
                }
                placeholder="예: 사무엘상"
                onChange={
                  (event) =>
                    setTitleKo(
                      event.target.value
                    )
                }
              />

            </div>


            <div
              className={
                styles.field
              }
            >

              <label
                htmlFor="titleEn"
              >
                영문 제목
              </label>

              <input
                id="titleEn"
                type="text"
                value={
                  titleEn
                }
                placeholder="예: 1 Samuel"
                onChange={
                  (event) =>
                    setTitleEn(
                      event.target.value
                    )
                }
              />

            </div>

          </div>


          {/* SLUG */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="slug"
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              value={
                slug
              }
              placeholder="예: 1-samuel"
              onChange={
                (event) =>
                  setSlug(
                    event.target.value
                  )
              }
            />

            <small>
              URL에 사용됩니다. Firestore 문서 ID는
              type__slug 형식으로 자동 생성됩니다.
            </small>

          </div>


          {/* EYEBROW */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="eyebrow"
            >
              Eyebrow
            </label>

            <input
              id="eyebrow"
              type="text"
              value={
                eyebrow
              }
              placeholder="예: BIBLE · OLD TESTAMENT"
              onChange={
                (event) =>
                  setEyebrow(
                    event.target.value
                  )
              }
            />

          </div>


          {/* SUMMARY */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="summary"
            >
              요약
            </label>

            <textarea
              id="summary"
              value={
                summary
              }
              placeholder="콘텐츠를 설명하는 짧은 문장을 입력하세요."
              onChange={
                (event) =>
                  setSummary(
                    event.target.value
                  )
              }
            />

          </div>


          {/* =================================
              HERO IMAGE
              ================================= */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="heroImage"
            >
              Hero Image URL
            </label>

            <input
              id="heroImage"
              type="text"
              value={
                heroImage
              }
              placeholder="/assets/... 또는 Cloudinary URL"
              onChange={
                (event) =>
                  setHeroImage(
                    event.target.value
                  )
              }
            />

            <small>
              직접 이미지 경로를 입력하거나
              아래에서 이미지를 업로드할 수 있습니다.
            </small>

          </div>


          <HeroImageUploader
            value={
              heroImage
            }
            onChange={
              setHeroImage
            }
            contentType={
              type
            }
            slug={
              slug
            }
          />


          {/* =================================
              ORDER / STATUS
              ================================= */}

          <div
            className={
              styles.twoColumns
            }
          >

            <div
              className={
                styles.field
              }
            >

              <label
                htmlFor="order"
              >
                정렬 순서
              </label>

              <input
                id="order"
                type="number"
                min="0"
                value={
                  order
                }
                onChange={
                  (event) =>
                    setOrder(
                      event.target.value
                    )
                }
              />

            </div>


            <div
              className={
                styles.field
              }
            >

              <label
                htmlFor="status"
              >
                상태
              </label>

              <select
                id="status"
                value={
                  status
                }
                onChange={
                  (event) =>
                    setStatus(
                      event.target.value
                    )
                }
              >

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

            </div>

          </div>


          {/* =================================
              VERIFICATION / SOURCES
              ================================= */}

          <div
            className={
              styles.sectionDivider
            }
          />


          <div
            className={
              styles.sectionHeader
            }
          >

            <small>
              VERIFICATION & SOURCES
            </small>

            <h2>
              검증 및 출처
            </h2>

            <p>
              성경 본문, 역사적 자료와
              시각적 재구성의 근거를
              구분하여 관리합니다.
            </p>

          </div>


          {/* VERIFICATION STATUS */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="verificationStatus"
            >
              검증 상태
            </label>

            <select
              id="verificationStatus"
              value={
                verificationStatus
              }
              onChange={
                (event) =>
                  setVerificationStatus(
                    event.target.value
                  )
              }
            >

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

            <small>
              콘텐츠 근거에 대한
              검토 진행 상태입니다.
            </small>

          </div>


          {/* BIBLICAL SOURCE */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="biblicalSource"
            >
              Biblical Source
            </label>

            <textarea
              id="biblicalSource"
              value={
                biblicalSource
              }
              placeholder="예: 1 Samuel 17:1–58"
              onChange={
                (event) =>
                  setBiblicalSource(
                    event.target.value
                  )
              }
            />

            <small>
              콘텐츠의 직접적인
              성경 본문 근거를 입력합니다.
            </small>

          </div>


          {/* HISTORICAL SOURCE */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="historicalSource"
            >
              Historical Source
            </label>

            <textarea
              id="historicalSource"
              value={
                historicalSource
              }
              placeholder="역사·고고학·문화적 배경에 사용한 자료를 입력하세요."
              onChange={
                (event) =>
                  setHistoricalSource(
                    event.target.value
                  )
              }
            />

          </div>


          {/* INTERPRETATION NOTE */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="interpretationNote"
            >
              Interpretation Note
            </label>

            <textarea
              id="interpretationNote"
              value={
                interpretationNote
              }
              placeholder="본문에 대한 해석 또는 견해가 포함된 경우 그 범위를 입력하세요."
              onChange={
                (event) =>
                  setInterpretationNote(
                    event.target.value
                  )
              }
            />

          </div>


          {/* VISUAL RECONSTRUCTION NOTE */}

          <div
            className={
              styles.field
            }
          >

            <label
              htmlFor="visualReconstructionNote"
            >
              Visual Reconstruction Note
            </label>

            <textarea
              id="visualReconstructionNote"
              value={
                visualReconstructionNote
              }
              placeholder="AI 이미지 또는 역사적 고증을 바탕으로 재구성한 이미지의 기준을 입력하세요."
              onChange={
                (event) =>
                  setVisualReconstructionNote(
                    event.target.value
                  )
              }
            />

            <small>
              실제 사진·유물이 아니라
              시각적 재구성인 경우 기록합니다.
            </small>

          </div>


          {/* =================================
              RELATION EDITOR
              ================================= */}

          <div
            className={
              styles.sectionDivider
            }
          />


          <RelationEditor
            value={
              relations
            }
            onChange={
              setRelations
            }
            currentType={
              type
            }
            currentSlug={
              slug
            }
          />


          {/* =================================
              ERROR
              ================================= */}

          {errorMessage && (
            <div
              className={
                styles.error
              }
            >
              {errorMessage}
            </div>
          )}


          {/* =================================
              ACTIONS
              ================================= */}

          <div
            className={
              styles.actions
            }
          >

            <Link
              href="/admin/contents"
              className={
                styles.cancelButton
              }
            >
              취소
            </Link>


            <button
              type="submit"
              className={
                styles.saveButton
              }
              disabled={
                saving
              }
            >
              {saving
                ? "저장 중..."
                : "콘텐츠 저장"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}