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


type PeriodRecord = {
  id: string;

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  order: number;
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


export default function TimelineArchiveFirebase() {

  const [
    periods,
    setPeriods,
  ] =
    useState<PeriodRecord[]>([]);


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


    async function loadTimeline() {

      try {

        setLoading(true);
        setErrorMessage("");


        /*
         * Firestore Rules 대응
         *
         * published 조건은
         * query에 반드시 포함합니다.
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
              ): PeriodRecord | null => {

                const data =
                  document.data();


                if (
                  data.type !==
                  "period"
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
              ): item is PeriodRecord =>
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


        setPeriods(
          records
        );


      } catch (error) {

        console.error(
          "[TimelineArchiveFirebase]",
          error
        );


        if (!active) {
          return;
        }


        setErrorMessage(
          "시대 데이터를 불러오지 못했습니다."
        );


      } finally {

        if (active) {
          setLoading(false);
        }
      }
    }


    void loadTimeline();


    return () => {
      active = false;
    };

  }, []);


  /*
   * =====================================
   * HEADER
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
        TIMELINE
      </h1>

      <p>
        성경의 시대적 흐름을 따라 인물과 사건,
        장소와 성경 기록이 어떻게 이어지는지
        탐험하세요.
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
          className="timelineArchive"
        >

          <div
            className="timelineSectionHead"
          >

            <small>
              BIBLICAL TIMELINE
            </small>

            <h2>
              시대 기록을 불러오고 있습니다
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
          className="timelineArchive"
        >

          <div
            className="timelineSectionHead"
          >

            <small>
              BIBLICAL TIMELINE
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
   * EMPTY
   * =====================================
   */

  if (
    periods.length === 0
  ) {

    return (
      <main>

        {head}

        <section
          className="timelineArchive"
        >

          <div
            className="timelineSectionHead"
          >

            <small>
              BIBLICAL TIMELINE
            </small>

            <h2>
              등록된 시대가 없습니다
            </h2>

            <p>
              Published 상태의 시대 콘텐츠를
              등록해주세요.
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
        className="timelineArchive"
      >

        <div
          className="timelineSectionHead"
        >

          <small>
            BIBLICAL TIMELINE
          </small>

          <h2>
            시대의 흐름을 따라 성경의 세계를
            탐험하세요
          </h2>

          <p>
            각 시대를 따라 주요 인물과 장소,
            사건과 성경 기록이 어떻게 이어지는지
            살펴볼 수 있습니다.
          </p>

        </div>


        <div
          className="timelineTrack"
        >

          {periods.map(
            (
              period,
              index
            ) => (

              <Link
                className="timelineEntry"
                key={
                  period.id
                }
                href={
                  `/timeline/${period.slug}`
                }
              >

                <div
                  className="timelineMarker"
                >

                  <span>
                    {
                      String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )
                    }
                  </span>

                </div>


                <div
                  className="timelineEntryImage"
                  style={{
                    backgroundImage:
                      `url("${period.heroImage}")`,
                  }}
                />


                <div
                  className="timelineEntryContent"
                >

                  <small>
                    {period.eyebrow}
                  </small>

                  <h2>
                    {period.titleKo}
                  </h2>

                  <b>
                    {period.titleEn}
                  </b>

                  <p>
                    {period.summary}
                  </p>

                  <span>
                    EXPLORE PERIOD →
                  </span>

                </div>

              </Link>

            )
          )}

        </div>

      </section>

    </main>
  );
}