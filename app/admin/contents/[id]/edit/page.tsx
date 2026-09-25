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
  useParams,
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
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../../../../lib/firebase";

import RelationEditor, {
  type RelationValue,
} from "../../../../../components/admin/RelationEditor";

import HeroImageUploader
  from "../../../../../components/admin/HeroImageUploader";

import styles
  from "../../new/page.module.css";


/* =====================================================
   TYPES
   ===================================================== */

type BookSection = {
  number: string;
  title: string;
  scripture: string;
  description: string;
};


type StoryScene = {
  number: string;
  title: string;
  scripture: string;
  description: string;
  image: string;
};


/* =====================================================
   RELATION VALIDATION
   ===================================================== */

function isRelationTargetType(
  value: unknown
): value is RelationValue["targetType"] {
  return (
    value === "person" ||
    value === "place" ||
    value === "story" ||
    value === "period" ||
    value === "book"
  );
}


function isRelationType(
  value: unknown
): value is RelationValue["relationType"] {
  return (
    value === "RELATED_PERSON" ||
    value === "RELATED_PLACE" ||
    value === "RELATED_STORY" ||
    value === "RELATED_PERIOD" ||
    value === "RELATED_BOOK"
  );
}


function normalizeRelations(
  value: unknown
): RelationValue[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: RelationValue[] = [];

  value.forEach(
    (relation) => {
      if (
        typeof relation !== "object" ||
        relation === null
      ) {
        return;
      }

      const source =
        relation as Record<
          string,
          unknown
        >;

      if (
        !isRelationTargetType(
          source.targetType
        ) ||
        typeof source.targetSlug !==
          "string" ||
        !isRelationType(
          source.relationType
        ) ||
        typeof source.label !==
          "string"
      ) {
        return;
      }

      result.push({
        targetType:
          source.targetType,

        targetSlug:
          source.targetSlug,

        relationType:
          source.relationType,

        label:
          source.label,
      });
    }
  );

  return result;
}


/* =====================================================
   BOOK SECTION NORMALIZER
   ===================================================== */

function normalizeBookSections(
  value: unknown
): BookSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (
      section,
      index
    ) => {
      const source:
        Record<string, unknown> =
        typeof section === "object" &&
        section !== null
          ? section as Record<
              string,
              unknown
            >
          : {};

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
   STORY SCENE NORMALIZER
   ===================================================== */

function normalizeStoryScenes(
  value: unknown
): StoryScene[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (
      scene,
      index
    ) => {
      const source:
        Record<string, unknown> =
        typeof scene === "object" &&
        scene !== null
          ? scene as Record<
              string,
              unknown
            >
          : {};

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

        image:
          typeof source.image ===
          "string"
            ? source.image
            : "",
      };
    }
  );
}


/* =====================================================
   PAGE
   ===================================================== */

export default function EditContentPage() {
  const router =
    useRouter();

  const params =
    useParams();

  const rawId =
    params.id;

  const contentId =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : "";


  /* =====================================================
     PAGE STATE
     ===================================================== */

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    trashing,
    setTrashing,
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
     DETAIL FIELDS
     ===================================================== */

  const [
    overview,
    setOverview,
  ] =
    useState("");

  const [
    biblicalContext,
    setBiblicalContext,
  ] =
    useState("");

  const [
    scriptureText,
    setScriptureText,
  ] =
    useState("");


  /* =====================================================
     BIBLE FIELDS
     ===================================================== */

  const [
    bookSections,
    setBookSections,
  ] =
    useState<
      BookSection[]
    >([]);


  /* =====================================================
     STORY FIELDS
     ===================================================== */

  const [
    storyScenes,
    setStoryScenes,
  ] =
    useState<
      StoryScene[]
    >([]);


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
     AUTH + CONTENT LOAD
     ===================================================== */

  useEffect(() => {
    if (!contentId) {
      setErrorMessage(
        "콘텐츠 ID를 확인할 수 없습니다."
      );

      setLoading(false);

      return;
    }


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


            /* =========================
               CONTENT LOAD
               ========================= */

            const contentRef =
              doc(
                db,
                "contents",
                contentId
              );

            const contentSnapshot =
              await getDoc(
                contentRef
              );

            if (
              !contentSnapshot.exists()
            ) {
              setErrorMessage(
                "콘텐츠를 찾을 수 없습니다."
              );

              setLoading(false);

              return;
            }


            const data =
              contentSnapshot.data();


            /* =========================
               COMMON FIELDS
               ========================= */

            setType(
              typeof data.type ===
              "string"
                ? data.type
                : "book"
            );

            setTitleKo(
              typeof data.titleKo ===
              "string"
                ? data.titleKo
                : ""
            );

            setTitleEn(
              typeof data.titleEn ===
              "string"
                ? data.titleEn
                : ""
            );

            setSlug(
              typeof data.slug ===
              "string"
                ? data.slug
                : ""
            );

            setEyebrow(
              typeof data.eyebrow ===
              "string"
                ? data.eyebrow
                : ""
            );

            setSummary(
              typeof data.summary ===
              "string"
                ? data.summary
                : ""
            );

            setHeroImage(
              typeof data.heroImage ===
              "string"
                ? data.heroImage
                : ""
            );


            /*
             * 기존 private 문서는
             * hidden 상태로 호환
             */

            setStatus(
              data.status === "private"
                ? "hidden"
                : data.status === "review"
                  ? "review"
                  : data.status === "published"
                    ? "published"
                    : data.status === "hidden"
                      ? "hidden"
                      : "draft"
            );


            setOrder(
              typeof data.order ===
              "number"
                ? String(
                    data.order
                  )
                : "1"
            );


            /* =========================
               VERIFICATION / SOURCES
               ========================= */

            setVerificationStatus(
              typeof data.verificationStatus ===
              "string"
                ? data.verificationStatus
                : "not_reviewed"
            );

            setBiblicalSource(
              typeof data.biblicalSource ===
              "string"
                ? data.biblicalSource
                : ""
            );

            setHistoricalSource(
              typeof data.historicalSource ===
              "string"
                ? data.historicalSource
                : ""
            );

            setInterpretationNote(
              typeof data.interpretationNote ===
              "string"
                ? data.interpretationNote
                : ""
            );

            setVisualReconstructionNote(
              typeof data.visualReconstructionNote ===
              "string"
                ? data.visualReconstructionNote
                : ""
            );


            /* =========================
               DETAIL FIELDS
               ========================= */

            setOverview(
              typeof data.overview ===
              "string"
                ? data.overview
                : ""
            );

            setBiblicalContext(
              typeof data.biblicalContext ===
              "string"
                ? data.biblicalContext
                : ""
            );


            /* =========================
               SCRIPTURE
               ========================= */

            if (
              Array.isArray(
                data.scripture
              )
            ) {
              const scriptureLines =
                data.scripture
                  .filter(
                    (
                      item
                    ) =>
                      typeof item ===
                      "string"
                  )
                  .join(
                    "\n"
                  );

              setScriptureText(
                scriptureLines
              );

            } else {
              setScriptureText(
                ""
              );
            }


            /* =========================
               BOOK SECTIONS
               ========================= */

            setBookSections(
              normalizeBookSections(
                data.bookSections
              )
            );


            /* =========================
               STORY SCENES
               ========================= */

            setStoryScenes(
              normalizeStoryScenes(
                data.scenes
              )
            );


            /* =========================
               RELATIONS
               ========================= */

            setRelations(
              normalizeRelations(
                data.relations
              )
            );


            setLoading(
              false
            );

          } catch (error) {
            console.error(
              "콘텐츠 로드 오류:",
              error
            );

            setErrorMessage(
              "콘텐츠를 불러오지 못했습니다."
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
    contentId,
    router,
  ]);


  /* =====================================================
     BOOK SECTION ADD
     ===================================================== */

  const addBookSection =
    () => {
      setBookSections(
        (current) => [
          ...current,

          {
            number:
              String(
                current.length + 1
              ).padStart(
                2,
                "0"
              ),

            title:
              "",

            scripture:
              "",

            description:
              "",
          },
        ]
      );
    };


  /* =====================================================
     BOOK SECTION UPDATE
     ===================================================== */

  const updateBookSection =
    (
      index: number,
      field:
        keyof BookSection,
      value: string
    ) => {
      setBookSections(
        (current) =>
          current.map(
            (
              section,
              itemIndex
            ) => {
              if (
                itemIndex !== index
              ) {
                return section;
              }

              return {
                ...section,

                [field]:
                  value,
              };
            }
          )
      );
    };


  /* =====================================================
     BOOK SECTION REMOVE
     ===================================================== */

  const removeBookSection =
    (
      index: number
    ) => {
      setBookSections(
        (current) =>
          current.filter(
            (
              _,
              itemIndex
            ) =>
              itemIndex !== index
          )
      );
    };


  /* =====================================================
     STORY SCENE ADD
     ===================================================== */

  const addStoryScene =
    () => {
      setStoryScenes(
        (current) => [
          ...current,

          {
            number:
              String(
                current.length + 1
              ).padStart(
                2,
                "0"
              ),

            title:
              "",

            scripture:
              "",

            description:
              "",

            image:
              "",
          },
        ]
      );
    };


  /* =====================================================
     STORY SCENE UPDATE
     ===================================================== */

  const updateStoryScene =
    (
      index: number,
      field:
        keyof StoryScene,
      value: string
    ) => {
      setStoryScenes(
        (current) =>
          current.map(
            (
              scene,
              itemIndex
            ) => {
              if (
                itemIndex !== index
              ) {
                return scene;
              }

              return {
                ...scene,

                [field]:
                  value,
              };
            }
          )
      );
    };


  /* =====================================================
     STORY SCENE REMOVE
     ===================================================== */

  const removeStoryScene =
    (
      index: number
    ) => {
      setStoryScenes(
        (current) =>
          current.filter(
            (
              _,
              itemIndex
            ) =>
              itemIndex !== index
          )
      );
    };


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

      if (!contentId) {
        setErrorMessage(
          "콘텐츠 ID가 없습니다."
        );

        return;
      }

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


      try {
        setSaving(
          true
        );


        const contentRef =
          doc(
            db,
            "contents",
            contentId
          );


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

        const normalizedCurrentSlug =
          slug
            .trim()
            .toLowerCase();


        const safeRelations =
          cleanRelations.filter(
            (relation) =>
              !(
                relation.targetType ===
                  type &&
                relation.targetSlug ===
                  normalizedCurrentSlug
              )
          );


        /* =========================
           COMMON DATA
           ========================= */

        const commonData = {
          type,

          slug:
            normalizedCurrentSlug,

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

          updatedAt:
            serverTimestamp(),
        };


        /* =========================
           SCRIPTURE NORMALIZE
           ========================= */

        const scripture =
          scriptureText
            .split(
              "\n"
            )
            .map(
              (item) =>
                item.trim()
            )
            .filter(
              (item) =>
                item.length > 0
            );


        /* =========================
           BIBLE CONTENT
           ========================= */

        if (
          type === "book"
        ) {

          const cleanBookSections =
            bookSections
              .map(
                (section) => ({
                  number:
                    section.number
                      .trim(),

                  title:
                    section.title
                      .trim(),

                  scripture:
                    section.scripture
                      .trim(),

                  description:
                    section.description
                      .trim(),
                })
              )
              .filter(
                (section) =>
                  section.title !== "" ||
                  section.scripture !== "" ||
                  section.description !== ""
              );


          await updateDoc(
            contentRef,
            {
              ...commonData,

              overview:
                overview.trim(),

              biblicalContext:
                biblicalContext.trim(),

              scripture,

              bookSections:
                cleanBookSections,
            }
          );


        /* =========================
           STORY CONTENT
           ========================= */

        } else if (
          type === "story"
        ) {

          const cleanStoryScenes =
            storyScenes
              .map(
                (scene) => ({
                  number:
                    scene.number
                      .trim(),

                  title:
                    scene.title
                      .trim(),

                  scripture:
                    scene.scripture
                      .trim(),

                  description:
                    scene.description
                      .trim(),

                  image:
                    scene.image
                      .trim(),
                })
              )
              .filter(
                (scene) =>
                  scene.title !== "" ||
                  scene.scripture !== "" ||
                  scene.description !== "" ||
                  scene.image !== ""
              );


          await updateDoc(
            contentRef,
            {
              ...commonData,

              overview:
                overview.trim(),

              scripture,

              scenes:
                cleanStoryScenes,
            }
          );


        /* =========================
           OTHER CONTENT
           ========================= */

        } else {
          await updateDoc(
            contentRef,
            commonData
          );
        }


        router.push(
          "/admin/contents"
        );

      } catch (error) {
        console.error(
          "콘텐츠 수정 오류:",
          error
        );

        setErrorMessage(
          "콘텐츠 수정에 실패했습니다."
        );

      } finally {
        setSaving(
          false
        );
      }
    };


  /* =====================================================
     MOVE TO TRASH
     ===================================================== */

  const handleMoveToTrash =
    async () => {

      if (
        !contentId ||
        saving ||
        trashing
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          `"${titleKo || "이 콘텐츠"}"를 휴지통으로 이동하시겠습니까?\n\n공개 사이트에서는 즉시 숨겨지지만 Firestore 데이터는 삭제되지 않습니다.`
        );


      if (!confirmed) {
        return;
      }


      try {
        setTrashing(
          true
        );

        setErrorMessage(
          ""
        );


        const contentRef =
          doc(
            db,
            "contents",
            contentId
          );


        await updateDoc(
          contentRef,
          {
            status:
              "hidden",

            trashedAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );


        router.push(
          "/admin/contents"
        );

      } catch (error) {
        console.error(
          "휴지통 이동 오류:",
          error
        );

        setErrorMessage(
          "콘텐츠를 휴지통으로 이동하지 못했습니다."
        );

      } finally {
        setTrashing(
          false
        );
      }
    };


  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
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

        {/* HEADER */}

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
            CONTENT EDITOR
          </small>

          <h1>
            콘텐츠 수정
          </h1>

          <p>
            SCRAPTURA 콘텐츠의 정보와
            상세 구조를 수정합니다.
          </p>
        </header>


        <form
          className={
            styles.form
          }
          onSubmit={
            handleSubmit
          }
        >

          {/* BASIC INFORMATION */}

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
              onChange={
                (event) =>
                  setSlug(
                    event.target.value
                  )
              }
            />

            <small>
              공개 URL에서 사용되는
              고유 식별자입니다.
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
              onChange={
                (event) =>
                  setSummary(
                    event.target.value
                  )
              }
            />
          </div>


          {/* HERO IMAGE */}

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


          {/* ORDER / STATUS */}

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


          {/* STORY CONTENT */}

          {type ===
            "story" && (
            <>
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
                  STORY CONTENT
                </small>

                <h2>
                  스토리 상세 정보
                </h2>

                <p>
                  이야기의 개요와 성경 범위,
                  Scene Sequence를 관리합니다.
                </p>
              </div>


              {/* STORY OVERVIEW */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="storyOverview"
                >
                  Overview
                </label>

                <textarea
                  id="storyOverview"
                  value={
                    overview
                  }
                  placeholder="이 스토리의 전체 흐름과 배경을 입력하세요."
                  onChange={
                    (event) =>
                      setOverview(
                        event.target.value
                      )
                  }
                />
              </div>


              {/* STORY SCRIPTURE */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="storyScripture"
                >
                  Scripture
                </label>

                <textarea
                  id="storyScripture"
                  value={
                    scriptureText
                  }
                  placeholder={`1 Samuel 17
1 Samuel 18:1–5`}
                  onChange={
                    (event) =>
                      setScriptureText(
                        event.target.value
                      )
                  }
                />

                <small>
                  성경 범위를 한 줄에
                  하나씩 입력하세요.
                </small>
              </div>


              {/* SCENE SEQUENCE */}

              <div
                className={
                  styles.bookSectionHead
                }
              >
                <div>
                  <small>
                    SCENE SEQUENCE
                  </small>

                  <h3>
                    이야기 장면
                  </h3>

                  <p>
                    STORY 상세페이지에
                    순서대로 표시되는 장면을
                    관리합니다.
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    styles.addSectionButton
                  }
                  onClick={
                    addStoryScene
                  }
                >
                  + 장면 추가
                </button>
              </div>


              <div
                className={
                  styles.bookSectionList
                }
              >
                {storyScenes.length ===
                  0 && (
                  <div
                    className={
                      styles.sectionEmpty
                    }
                  >
                    아직 등록된 Scene이
                    없습니다.
                  </div>
                )}


                {storyScenes.map(
                  (
                    scene,
                    index
                  ) => (
                    <article
                      className={
                        styles.bookSectionCard
                      }
                      key={
                        `story-scene-${index}`
                      }
                    >

                      <div
                        className={
                          styles.bookSectionTop
                        }
                      >
                        <strong>
                          SCENE{" "}
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </strong>

                        <button
                          type="button"
                          className={
                            styles.removeSectionButton
                          }
                          onClick={
                            () =>
                              removeStoryScene(
                                index
                              )
                          }
                        >
                          삭제
                        </button>
                      </div>


                      <div
                        className={
                          styles.sectionFields
                        }
                      >
                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Number
                          </label>

                          <input
                            type="text"
                            value={
                              scene.number
                            }
                            onChange={
                              (event) =>
                                updateStoryScene(
                                  index,
                                  "number",
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
                          <label>
                            Title
                          </label>

                          <input
                            type="text"
                            value={
                              scene.title
                            }
                            placeholder="예: THE VALLEY"
                            onChange={
                              (event) =>
                                updateStoryScene(
                                  index,
                                  "title",
                                  event.target.value
                                )
                            }
                          />
                        </div>
                      </div>


                      <div
                        className={
                          styles.field
                        }
                      >
                        <label>
                          Scripture
                        </label>

                        <input
                          type="text"
                          value={
                            scene.scripture
                          }
                          placeholder="예: 1 Samuel 17:1–3"
                          onChange={
                            (event) =>
                              updateStoryScene(
                                index,
                                "scripture",
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
                        <label>
                          Description
                        </label>

                        <textarea
                          value={
                            scene.description
                          }
                          placeholder="이 장면에서 일어나는 사건을 입력하세요."
                          onChange={
                            (event) =>
                              updateStoryScene(
                                index,
                                "description",
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
                        <label>
                          Scene Image URL
                        </label>

                        <input
                          type="text"
                          value={
                            scene.image
                          }
                          placeholder="/assets/... 또는 Cloudinary URL"
                          onChange={
                            (event) =>
                              updateStoryScene(
                                index,
                                "image",
                                event.target.value
                              )
                          }
                        />

                        <small>
                          기존 이미지 경로나
                          Cloudinary URL을 입력할 수 있습니다.
                        </small>
                      </div>

                    </article>
                  )
                )}
              </div>
            </>
          )}


          {/* BIBLE CONTENT */}

          {type ===
            "book" && (
            <>
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
                  BIBLE CONTENT
                </small>

                <h2>
                  성경 상세 정보
                </h2>

                <p>
                  BIBLE 상세페이지에 표시되는
                  설명과 본문의 흐름을 관리합니다.
                </p>
              </div>


              {/* OVERVIEW */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="overview"
                >
                  Overview
                </label>

                <textarea
                  id="overview"
                  value={
                    overview
                  }
                  placeholder="성경책 전체 내용을 소개하는 설명을 입력하세요."
                  onChange={
                    (event) =>
                      setOverview(
                        event.target.value
                      )
                  }
                />
              </div>


              {/* BIBLICAL CONTEXT */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="biblicalContext"
                >
                  Biblical Context
                </label>

                <textarea
                  id="biblicalContext"
                  value={
                    biblicalContext
                  }
                  placeholder="성경적·역사적 배경과 흐름을 입력하세요."
                  onChange={
                    (event) =>
                      setBiblicalContext(
                        event.target.value
                      )
                  }
                />
              </div>


              {/* SCRIPTURE */}

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="scripture"
                >
                  Scripture
                </label>

                <textarea
                  id="scripture"
                  value={
                    scriptureText
                  }
                  placeholder={`1 Samuel 1–31
2 Samuel 1–24`}
                  onChange={
                    (event) =>
                      setScriptureText(
                        event.target.value
                      )
                  }
                />

                <small>
                  성경 범위를 한 줄에
                  하나씩 입력하세요.
                </small>
              </div>


              {/* BOOK JOURNEY */}

              <div
                className={
                  styles.bookSectionHead
                }
              >
                <div>
                  <small>
                    BOOK JOURNEY
                  </small>

                  <h3>
                    책의 주요 흐름
                  </h3>

                  <p>
                    BIBLE 상세페이지의
                    Book Journey에 순서대로
                    표시됩니다.
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    styles.addSectionButton
                  }
                  onClick={
                    addBookSection
                  }
                >
                  + 구간 추가
                </button>
              </div>


              <div
                className={
                  styles.bookSectionList
                }
              >
                {bookSections.length ===
                  0 && (
                  <div
                    className={
                      styles.sectionEmpty
                    }
                  >
                    아직 등록된 Book Section이
                    없습니다.
                  </div>
                )}


                {bookSections.map(
                  (
                    section,
                    index
                  ) => (
                    <article
                      className={
                        styles.bookSectionCard
                      }
                      key={
                        `book-section-${index}`
                      }
                    >

                      <div
                        className={
                          styles.bookSectionTop
                        }
                      >
                        <strong>
                          SECTION{" "}
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </strong>

                        <button
                          type="button"
                          className={
                            styles.removeSectionButton
                          }
                          onClick={
                            () =>
                              removeBookSection(
                                index
                              )
                          }
                        >
                          삭제
                        </button>
                      </div>


                      <div
                        className={
                          styles.sectionFields
                        }
                      >
                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Number
                          </label>

                          <input
                            type="text"
                            value={
                              section.number
                            }
                            onChange={
                              (event) =>
                                updateBookSection(
                                  index,
                                  "number",
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
                          <label>
                            Title
                          </label>

                          <input
                            type="text"
                            value={
                              section.title
                            }
                            placeholder="예: DAVID & GOLIATH"
                            onChange={
                              (event) =>
                                updateBookSection(
                                  index,
                                  "title",
                                  event.target.value
                                )
                            }
                          />
                        </div>
                      </div>


                      <div
                        className={
                          styles.field
                        }
                      >
                        <label>
                          Scripture
                        </label>

                        <input
                          type="text"
                          value={
                            section.scripture
                          }
                          placeholder="예: 1 Samuel 17"
                          onChange={
                            (event) =>
                              updateBookSection(
                                index,
                                "scripture",
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
                        <label>
                          Description
                        </label>

                        <textarea
                          value={
                            section.description
                          }
                          placeholder="이 구간에서 전개되는 주요 내용을 입력하세요."
                          onChange={
                            (event) =>
                              updateBookSection(
                                index,
                                "description",
                                event.target.value
                              )
                          }
                        />
                      </div>

                    </article>
                  )
                )}
              </div>
            </>
          )}


          {/* VERIFICATION / SOURCES */}

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
              성경 본문과 역사적 자료,
              해석 및 시각적 재구성의
              근거를 구분하여 관리합니다.
            </p>
          </div>


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
              해당 콘텐츠의 직접적인
              성경 본문 근거를 기록합니다.
            </small>
          </div>


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

            <small>
              역사적 배경이나 고고학적
              참고 자료가 있는 경우 기록합니다.
            </small>
          </div>


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
              실제 역사 사진 또는 유물이 아닌
              시각적 재구성 자료라면
              그 기준과 한계를 기록합니다.
            </small>
          </div>


          {/* RELATION EDITOR */}

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


          {/* ERROR */}

          {errorMessage && (
            <div
              className={
                styles.error
              }
            >
              {errorMessage}
            </div>
          )}


          {/* ACTIONS */}

          <div
            className={
              styles.actions
            }
          >

            <button
              type="button"
              className={
                styles.cancelButton
              }
              disabled={
                saving ||
                trashing
              }
              onClick={
                handleMoveToTrash
              }
              style={{
                marginRight:
                  "auto",

                borderColor:
                  "rgba(190, 80, 70, 0.55)",

                color:
                  "#d88b82",
              }}
            >
              {trashing
                ? "이동 중..."
                : "휴지통으로 이동"}
            </button>


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
                saving ||
                trashing
              }
            >
              {saving
                ? "저장 중..."
                : "변경사항 저장"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}