"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
} from "../../lib/firebase";

import {
  nodes,
} from "../../data/content";

import styles from "./RelationEditor.module.css";


export type RelationTargetType =
  | "person"
  | "place"
  | "story"
  | "period"
  | "book";


export type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_STORY"
  | "RELATED_PERIOD"
  | "RELATED_BOOK";


export type RelationValue = {
  targetType: RelationTargetType;
  targetSlug: string;
  relationType: RelationType;
  label: string;
};


type RelationCandidate = {
  type: RelationTargetType;
  slug: string;
  titleKo: string;
  titleEn: string;
  status: string;
};


type RelationEditorProps = {
  value: RelationValue[];

  onChange: (
    value: RelationValue[]
  ) => void;

  currentType?: string;
  currentSlug?: string;
};


const TARGET_OPTIONS: Array<{
  value: RelationTargetType;
  label: string;
}> = [
  {
    value: "person",
    label: "PEOPLE / 인물",
  },
  {
    value: "place",
    label: "PLACES / 장소",
  },
  {
    value: "story",
    label: "STORIES / 이야기",
  },
  {
    value: "period",
    label: "TIMELINE / 시대",
  },
  {
    value: "book",
    label: "BIBLE / 성경",
  },
];


function getRelationType(
  targetType: RelationTargetType
): RelationType {

  switch (
    targetType
  ) {

    case "person":
      return "RELATED_PERSON";

    case "place":
      return "RELATED_PLACE";

    case "story":
      return "RELATED_STORY";

    case "period":
      return "RELATED_PERIOD";

    case "book":
      return "RELATED_BOOK";

  }

}


function createEmptyRelation():
  RelationValue {

  return {
    targetType:
      "person",

    targetSlug:
      "",

    relationType:
      "RELATED_PERSON",

    label:
      "",
  };

}


function isRelationTargetType(
  value: unknown
): value is RelationTargetType {

  return (
    value === "person" ||
    value === "place" ||
    value === "story" ||
    value === "period" ||
    value === "book"
  );

}


function makeRelationKey(
  type: string,
  slug: string
) {

  return `${type}__${slug
    .trim()
    .toLowerCase()}`;

}


export default function RelationEditor({
  value,
  onChange,
  currentType,
  currentSlug,
}: RelationEditorProps) {

  const [
    candidates,
    setCandidates,
  ] =
    useState<
      RelationCandidate[]
    >([]);


  const [
    loadingCandidates,
    setLoadingCandidates,
  ] =
    useState(true);


  const [
    searchTerms,
    setSearchTerms,
  ] =
    useState<
      Record<
        number,
        string
      >
    >({});


  /*
   * =====================================
   * CURRENT CONTENT KEY
   * =====================================
   */

  const currentContentKey =
    currentType &&
    currentSlug
      ? makeRelationKey(
          currentType,
          currentSlug
        )
      : "";


  /*
   * =====================================
   * LOAD CANDIDATES
   * =====================================
   */

  useEffect(() => {

    let cancelled =
      false;


    const loadCandidates =
      async () => {

        const merged =
          new Map<
            string,
            RelationCandidate
          >();


        /*
         * LEGACY CONTENT
         */

        nodes.forEach(
          (
            node
          ) => {

            if (
              !isRelationTargetType(
                node.type
              )
            ) {
              return;
            }


            const key =
              makeRelationKey(
                node.type,
                node.slug
              );


            merged.set(
              key,
              {
                type:
                  node.type,

                slug:
                  node.slug,

                titleKo:
                  node.titleKo,

                titleEn:
                  node.titleEn,

                status:
                  "legacy",
              }
            );

          }
        );


        try {

          /*
           * FIRESTORE CONTENT
           */

          const snapshot =
            await getDocs(
              collection(
                db,
                "contents"
              )
            );


          snapshot.forEach(
            (
              contentDocument
            ) => {

              const data =
                contentDocument.data();


              if (
                !isRelationTargetType(
                  data.type
                )
              ) {
                return;
              }


              if (
                typeof data.slug !==
                  "string" ||
                typeof data.titleKo !==
                  "string"
              ) {
                return;
              }


              const key =
                makeRelationKey(
                  data.type,
                  data.slug
                );


              merged.set(
                key,
                {
                  type:
                    data.type,

                  slug:
                    data.slug,

                  titleKo:
                    data.titleKo,

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
                }
              );

            }
          );


        } catch (
          error
        ) {

          console.error(
            "Relation candidate load error:",
            error
          );

        }


        if (
          cancelled
        ) {
          return;
        }


        const result =
          Array.from(
            merged.values()
          ).sort(
            (
              a,
              b
            ) =>
              a.titleKo.localeCompare(
                b.titleKo,
                "ko"
              )
          );


        setCandidates(
          result
        );


        setLoadingCandidates(
          false
        );

      };


    loadCandidates();


    return () => {

      cancelled =
        true;

    };

  }, []);


  /*
   * =====================================
   * RELATION KEYS
   * =====================================
   */

  const relationKeys =
    useMemo(
      () =>
        value.map(
          (
            relation
          ) =>
            relation.targetSlug
              ? makeRelationKey(
                  relation.targetType,
                  relation.targetSlug
                )
              : ""
        ),
      [
        value,
      ]
    );


  /*
   * =====================================
   * ADD
   * =====================================
   */

  const handleAdd =
    () => {

      onChange([
        ...value,
        createEmptyRelation(),
      ]);

    };


  /*
   * =====================================
   * REMOVE
   * =====================================
   */

  const handleRemove =
    (
      index: number
    ) => {

      onChange(
        value.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
      );


      setSearchTerms(
        (
          current
        ) => {

          const next =
            {
              ...current,
            };


          delete next[
            index
          ];


          return next;

        }
      );

    };


  /*
   * =====================================
   * TYPE CHANGE
   * =====================================
   */

  const handleTypeChange =
    (
      index: number,
      targetType:
        RelationTargetType
    ) => {

      onChange(
        value.map(
          (
            relation,
            currentIndex
          ) => {

            if (
              currentIndex !==
              index
            ) {
              return relation;
            }


            return {
              targetType,

              targetSlug:
                "",

              relationType:
                getRelationType(
                  targetType
                ),

              label:
                "",
            };

          }
        )
      );


      setSearchTerms(
        (
          current
        ) => ({
          ...current,

          [index]:
            "",
        })
      );

    };


  /*
   * =====================================
   * MANUAL SLUG
   * =====================================
   */

  const handleSlugChange =
    (
      index: number,
      targetSlug: string
    ) => {

      onChange(
        value.map(
          (
            relation,
            currentIndex
          ) => {

            if (
              currentIndex !==
              index
            ) {
              return relation;
            }


            return {
              ...relation,

              targetSlug:
                targetSlug
                  .trimStart()
                  .toLowerCase(),
            };

          }
        )
      );

    };


  /*
   * =====================================
   * LABEL
   * =====================================
   */

  const handleLabelChange =
    (
      index: number,
      label: string
    ) => {

      onChange(
        value.map(
          (
            relation,
            currentIndex
          ) => {

            if (
              currentIndex !==
              index
            ) {
              return relation;
            }


            return {
              ...relation,
              label,
            };

          }
        )
      );

    };


  /*
   * =====================================
   * PICK CONTENT
   * =====================================
   */

  const handleSelectCandidate =
    (
      index: number,
      candidate:
        RelationCandidate
    ) => {

      const candidateKey =
        makeRelationKey(
          candidate.type,
          candidate.slug
        );


      /*
       * 자기 자신 연결 차단
       */

      if (
        currentContentKey &&
        candidateKey ===
          currentContentKey
      ) {

        window.alert(
          "현재 콘텐츠는 자기 자신과 연결할 수 없습니다."
        );

        return;

      }


      /*
       * 동일 Relation 중복 차단
       */

      const duplicateIndex =
        relationKeys.findIndex(
          (
            key,
            currentIndex
          ) =>
            currentIndex !==
              index &&
            key ===
              candidateKey
        );


      if (
        duplicateIndex !==
        -1
      ) {

        window.alert(
          "이미 연결된 콘텐츠입니다."
        );

        return;

      }


      onChange(
        value.map(
          (
            relation,
            currentIndex
          ) => {

            if (
              currentIndex !==
              index
            ) {
              return relation;
            }


            return {
              targetType:
                candidate.type,

              targetSlug:
                candidate.slug,

              relationType:
                getRelationType(
                  candidate.type
                ),

              label:
                candidate.titleKo,
            };

          }
        )
      );


      setSearchTerms(
        (
          current
        ) => ({
          ...current,

          [index]:
            "",
        })
      );

    };


  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <section
      className={
        styles.editor
      }
    >

      <div
        className={
          styles.header
        }
      >

        <div>

          <small>
            RELATION SYSTEM
          </small>


          <h2>
            관련 콘텐츠 연결
          </h2>


          <p>
            기존 콘텐츠를 검색해 연결합니다.
            중복 연결과 자기 자신 연결은
            자동으로 차단됩니다.
          </p>

        </div>


        <button
          type="button"

          className={
            styles.addButton
          }

          onClick={
            handleAdd
          }
        >
          + 관계 추가
        </button>

      </div>


      {loadingCandidates && (

        <div
          className={
            styles.loading
          }
        >
          연결 가능한 콘텐츠를
          불러오고 있습니다.
        </div>

      )}


      {value.length ===
      0 ? (

        <div
          className={
            styles.empty
          }
        >

          <strong>
            연결된 콘텐츠가 없습니다.
          </strong>


          <p>
            관계 추가 버튼을 눌러
            첫 연결을 등록하세요.
          </p>

        </div>

      ) : (

        <div
          className={
            styles.list
          }
        >

          {value.map(
            (
              relation,
              index
            ) => {

              const searchTerm =
                searchTerms[
                  index
                ] ??
                "";


              const normalizedSearch =
                searchTerm
                  .trim()
                  .toLowerCase();


              const currentRelationKey =
                relation.targetSlug
                  ? makeRelationKey(
                      relation.targetType,
                      relation.targetSlug
                    )
                  : "";


              /*
               * 수동 입력 시에도
               * 중복 여부 확인
               */

              const isDuplicate =
                currentRelationKey !==
                  "" &&
                relationKeys.some(
                  (
                    key,
                    currentIndex
                  ) =>
                    currentIndex !==
                      index &&
                    key ===
                      currentRelationKey
                );


              /*
               * 자기 자신 여부
               */

              const isSelfRelation =
                currentContentKey !==
                  "" &&
                currentRelationKey ===
                  currentContentKey;


              const matchingCandidates =
                normalizedSearch
                  ? candidates
                      .filter(
                        (
                          candidate
                        ) => {

                          if (
                            candidate.type !==
                            relation.targetType
                          ) {
                            return false;
                          }


                          const candidateKey =
                            makeRelationKey(
                              candidate.type,
                              candidate.slug
                            );


                          /*
                           * 자기 자신은 검색 결과에서 제외
                           */

                          if (
                            currentContentKey &&
                            candidateKey ===
                              currentContentKey
                          ) {
                            return false;
                          }


                          /*
                           * 다른 Relation에서 이미
                           * 선택된 대상 제외
                           */

                          const usedElsewhere =
                            relationKeys.some(
                              (
                                key,
                                currentIndex
                              ) =>
                                currentIndex !==
                                  index &&
                                key ===
                                  candidateKey
                            );


                          if (
                            usedElsewhere
                          ) {
                            return false;
                          }


                          return (
                            candidate.titleKo
                              .toLowerCase()
                              .includes(
                                normalizedSearch
                              ) ||

                            candidate.titleEn
                              .toLowerCase()
                              .includes(
                                normalizedSearch
                              ) ||

                            candidate.slug
                              .toLowerCase()
                              .includes(
                                normalizedSearch
                              )
                          );

                        }
                      )
                      .slice(
                        0,
                        8
                      )
                  : [];


              return (
                <article
                  className={
                    styles.card
                  }

                  key={
                    `relation-${index}`
                  }
                >

                  <div
                    className={
                      styles.cardTop
                    }
                  >

                    <div>

                      <small>
                        RELATION
                      </small>


                      <strong>
                        {String(
                          index +
                          1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </strong>

                    </div>


                    <button
                      type="button"

                      className={
                        styles.removeButton
                      }

                      onClick={
                        () =>
                          handleRemove(
                            index
                          )
                      }
                    >
                      삭제
                    </button>

                  </div>


                  {/* SEARCH */}

                  <div
                    className={
                      styles.picker
                    }
                  >

                    <label>

                      <span>
                        콘텐츠 검색
                      </span>


                      <input
                        type="search"

                        value={
                          searchTerm
                        }

                        placeholder=
                          "제목 또는 Slug 검색"

                        onChange={
                          (
                            event
                          ) =>
                            setSearchTerms(
                              (
                                current
                              ) => ({
                                ...current,

                                [index]:
                                  event.target.value,
                              })
                            )
                        }
                      />

                    </label>


                    {normalizedSearch &&
                      matchingCandidates.length >
                        0 && (

                      <div
                        className={
                          styles.results
                        }
                      >

                        {matchingCandidates.map(
                          (
                            candidate
                          ) => (

                            <button
                              type="button"

                              className={
                                styles.resultButton
                              }

                              key={
                                `${candidate.type}-${candidate.slug}`
                              }

                              onClick={
                                () =>
                                  handleSelectCandidate(
                                    index,
                                    candidate
                                  )
                              }
                            >

                              <div>

                                <strong>
                                  {candidate.titleKo}
                                </strong>


                                <span>
                                  {candidate.titleEn}
                                </span>

                              </div>


                              <div
                                className={
                                  styles.resultMeta
                                }
                              >

                                <small>
                                  {candidate.slug}
                                </small>


                                <em>
                                  {candidate.status ===
                                  "published"
                                    ? "PUBLIC"
                                    : candidate.status ===
                                      "legacy"
                                    ? "LEGACY"
                                    : candidate.status.toUpperCase()}
                                </em>

                              </div>

                            </button>

                          )
                        )}

                      </div>

                    )}


                    {normalizedSearch &&
                      matchingCandidates.length ===
                        0 && (

                      <div
                        className={
                          styles.noResult
                        }
                      >
                        연결 가능한 검색 결과가 없습니다.
                      </div>

                    )}

                  </div>


                  {/* FIELDS */}

                  <div
                    className={
                      styles.fields
                    }
                  >

                    <label>

                      <span>
                        연결 유형
                      </span>


                      <select
                        value={
                          relation.targetType
                        }

                        onChange={
                          (
                            event
                          ) =>
                            handleTypeChange(
                              index,
                              event.target
                                .value as
                                RelationTargetType
                            )
                        }
                      >

                        {TARGET_OPTIONS.map(
                          (
                            option
                          ) => (

                            <option
                              key={
                                option.value
                              }

                              value={
                                option.value
                              }
                            >
                              {option.label}
                            </option>

                          )
                        )}

                      </select>

                    </label>


                    <label>

                      <span>
                        Target Slug
                      </span>


                      <input
                        type="text"

                        value={
                          relation.targetSlug
                        }

                        onChange={
                          (
                            event
                          ) =>
                            handleSlugChange(
                              index,
                              event.target.value
                            )
                        }
                      />

                    </label>


                    <label>

                      <span>
                        표시 이름
                      </span>


                      <input
                        type="text"

                        value={
                          relation.label
                        }

                        onChange={
                          (
                            event
                          ) =>
                            handleLabelChange(
                              index,
                              event.target.value
                            )
                        }
                      />

                    </label>


                    <label>

                      <span>
                        Relation Type
                      </span>


                      <input
                        type="text"

                        value={
                          relation.relationType
                        }

                        readOnly
                      />

                    </label>

                  </div>


                  {/* WARNINGS */}

                  {isDuplicate && (

                    <div
                      style={{
                        marginTop:
                          "12px",

                        color:
                          "#d28a6f",

                        fontSize:
                          "10px",
                      }}
                    >
                      이미 등록된 Relation과 중복됩니다.
                    </div>

                  )}


                  {isSelfRelation && (

                    <div
                      style={{
                        marginTop:
                          "12px",

                        color:
                          "#d28a6f",

                        fontSize:
                          "10px",
                      }}
                    >
                      현재 콘텐츠는 자기 자신과 연결할 수 없습니다.
                    </div>

                  )}


                  {relation.targetSlug &&
                    !isDuplicate &&
                    !isSelfRelation && (

                    <div
                      className={
                        styles.selected
                      }
                    >

                      <small>
                        SELECTED
                      </small>


                      <strong>
                        {relation.label ||
                          relation.targetSlug}
                      </strong>


                      <span>
                        {relation.targetType}
                        {" · "}
                        {relation.targetSlug}
                      </span>

                    </div>

                  )}

                </article>
              );

            }
          )}

        </div>

      )}

    </section>
  );
}