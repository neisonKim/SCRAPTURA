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


type VisualRecord = {
  id: string;
  slug: string;
  titleKo: string;
  titleEn: string;
  eyebrow: string;
  summary: string;
  heroImage: string;
  order: number;
};


type VisualArchiveFirebaseProps = {
  title: string;
  subtitle: string;
};


function normalizeString(
  value: unknown
) {
  return typeof value === "string"
    ? value
    : "";
}


function normalizeNumber(
  value: unknown
) {
  return typeof value === "number"
    ? value
    : 9999;
}


export default function VisualArchiveFirebase({
  title,
  subtitle,
}: VisualArchiveFirebaseProps) {

  const [
    visuals,
    setVisuals,
  ] =
    useState<VisualRecord[]>([]);


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


  useEffect(() => {

    let active = true;


    async function loadVisuals() {

      try {

        setLoading(true);
        setErrorMessage("");


        /*
         * Firestore Rules 대응
         *
         * published 조건을
         * Query에 반드시 포함
         */

        const contentsQuery =
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
              ): VisualRecord | null => {

                const data =
                  document.data();


                if (
                  data.type !==
                  "visual"
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

                  heroImage:
                    normalizeString(
                      data.heroImage
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
              ): item is VisualRecord =>
                item !== null
            )
            .sort(
              (a, b) => {

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


        setVisuals(
          records
        );


      } catch (error) {

        console.error(
          "[VisualArchiveFirebase]",
          error
        );


        if (!active) {
          return;
        }


        setErrorMessage(
          "Visual 데이터를 불러오지 못했습니다."
        );


      } finally {

        if (active) {
          setLoading(false);
        }
      }
    }


    void loadVisuals();


    return () => {
      active = false;
    };

  }, []);


  /*
   * =====================================
   * PAGE HEADER
   * =====================================
   */

  const head = (

    <section
      className="pageHead"
    >

      <small>
        SCRAPTURA ARCHIVE
      </small>

      <h1>
        {title}
      </h1>

      <p>
        {subtitle}
      </p>

    </section>

  );


  /*
   * =====================================
   * LOADING
   * =====================================
   */

  if (loading) {

    return (
      <main>

        {head}

        <section
          className="visualArchive"
        >

          <div
            className="visualArchiveHead"
          >

            <small>
              VISUAL SCRIPTURE
            </small>

            <h2>
              시각 자료를 불러오고 있습니다
            </h2>

          </div>

        </section>

      </main>
    );
  }


  /*
   * =====================================
   * ERROR
   * =====================================
   */

  if (errorMessage) {

    return (
      <main>

        {head}

        <section
          className="visualArchive"
        >

          <div
            className="visualArchiveHead"
          >

            <small>
              VISUAL SCRIPTURE
            </small>

            <h2>
              데이터를 불러올 수 없습니다
            </h2>

            <p>
              {errorMessage}
            </p>

          </div>

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

      {head}


      <section
        className="visualArchive"
      >

        <div
          className="visualArchiveHead"
        >

          <small>
            VISUAL SCRIPTURE
          </small>

          <h2>
            성경의 세계를 장면과 이미지로
            탐험하세요
          </h2>

          <p>
            인물, 장소와 사건을 시각적으로
            연결하되, 모든 시각 자료는 성경
            본문과 역사적 맥락으로 다시 이어지는
            탐험의 입구가 됩니다.
          </p>

        </div>


        {visuals.length > 0 ? (

          <div
            className="visualMasonry"
          >

            {visuals.map(
              (
                visual,
                index
              ) => (

                <Link
                  className={
                    `visualArchiveCard visualArchiveCard${
                      (index % 3) + 1
                    }`
                  }
                  key={
                    visual.id
                  }
                  href={
                    `/visual/${visual.slug}`
                  }
                >

                  <div
                    className="visualArchiveImage"
                    style={{
                      backgroundImage:
                        `url("${visual.heroImage}")`,
                    }}
                  >

                    <div
                      className="visualArchiveShade"
                    />


                    <div
                      className="visualArchiveCopy"
                    >

                      <small>
                        {visual.eyebrow}
                      </small>

                      <h2>
                        {visual.titleKo}
                      </h2>

                      <b>
                        {visual.titleEn}
                      </b>

                      <p>
                        {visual.summary}
                      </p>

                      <span>
                        EXPLORE VISUAL →
                      </span>

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

        ) : (

          <div
            className="visualEmptyState"
          >

            <small>
              ARCHIVE IN PREPARATION
            </small>

            <h3>
              Visual Scripture Archive
            </h3>

            <p>
              성경 장면, 인물, 장소의 시각
              자료가 이곳에 연결됩니다.
            </p>


            <div
              className="visualEmptyGrid"
            >

              <div>
                <span>
                  01
                </span>

                <b>
                  STORY SCENES
                </b>

                <p>
                  이야기의 핵심 장면
                </p>
              </div>


              <div>
                <span>
                  02
                </span>

                <b>
                  PEOPLE
                </b>

                <p>
                  인물의 시각 기록
                </p>
              </div>


              <div>
                <span>
                  03
                </span>

                <b>
                  PLACES
                </b>

                <p>
                  성경 속 공간과 지형
                </p>
              </div>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}