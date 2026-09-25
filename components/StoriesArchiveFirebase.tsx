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


type StoryRecord = {
  id: string;
  slug: string;
  titleKo: string;
  titleEn: string;
  eyebrow: string;
  summary: string;
  heroImage: string;
  order: number;
};


type StoriesArchiveFirebaseProps = {
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


export default function StoriesArchiveFirebase({
  title,
  subtitle,
}: StoriesArchiveFirebaseProps) {

  const [
    stories,
    setStories,
  ] =
    useState<StoryRecord[]>([]);


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


    async function loadStories() {

      try {

        setLoading(true);
        setErrorMessage("");


        /*
         * Firestore Rules 대응
         *
         * published 조건을
         * 반드시 Query에 포함합니다.
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
              ): StoryRecord | null => {

                const data =
                  document.data();


                if (
                  data.type !==
                  "story"
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
              ): item is StoryRecord =>
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


        setStories(
          records
        );


      } catch (error) {

        console.error(
          "[StoriesArchiveFirebase]",
          error
        );


        if (!active) {
          return;
        }


        setErrorMessage(
          "이야기 데이터를 불러오지 못했습니다."
        );


      } finally {

        if (active) {
          setLoading(false);
        }
      }
    }


    void loadStories();


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
          className="archiveAllStories"
        >

          <div
            className="archiveSectionHead"
          >

            <small>
              STORIES ARCHIVE
            </small>

            <h2>
              이야기 기록을 불러오고 있습니다
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
          className="archiveAllStories"
        >

          <div
            className="archiveSectionHead"
          >

            <small>
              STORIES ARCHIVE
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
    stories.length === 0
  ) {
    return (
      <main>

        {head}

        <section
          className="archiveAllStories"
        >

          <div
            className="archiveSectionHead"
          >

            <small>
              STORIES ARCHIVE
            </small>

            <h2>
              등록된 이야기가 없습니다
            </h2>

            <p>
              Published 상태의 Story 콘텐츠를
              등록해주세요.
            </p>

          </div>

        </section>

      </main>
    );
  }


  /*
   * =====================================
   * FEATURED STORY
   * =====================================
   */

  const featured =
    stories.find(
      (story) =>
        story.slug ===
        "david-and-goliath"
    ) ??
    stories[0];


  const rest =
    stories.filter(
      (story) =>
        story.slug !==
        featured.slug
    );


  /*
   * =====================================
   * RENDER
   * =====================================
   */

  return (
    <main>

      {head}


      {/* =================================
          FEATURED STORY
      ================================= */}

      <section
        className="archiveFeaturedWrap"
      >

        <div
          className="archiveSectionHead"
        >

          <small>
            FEATURED STORY
          </small>

          <h2>
            이야기에서 성경의 세계로
            들어가세요
          </h2>

          <p>
            하나의 사건을 따라 인물, 장소,
            시대와 성경 본문으로 탐험을
            확장할 수 있습니다.
          </p>

        </div>


        <Link
          className="archiveFeatured"
          href={
            `/stories/${featured.slug}`
          }
        >

          <div
            className="archiveFeaturedImage"
            style={{
              backgroundImage:
                `url("${featured.heroImage}")`,
            }}
          />


          <div
            className="archiveFeaturedContent"
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

            <span>
              EXPLORE STORY →
            </span>

          </div>

        </Link>

      </section>


      {/* =================================
          STORY ARCHIVE
      ================================= */}

      {rest.length > 0 && (

        <section
          className="archiveAllStories"
        >

          <div
            className="archiveSectionHead"
          >

            <small>
              EXPLORE STORIES
            </small>

            <h2>
              더 많은 이야기를 탐험하세요
            </h2>

          </div>


          <div
            className="cardGrid"
          >

            {rest.map(
              (story) => (

                <Link
                  className="archiveCard"
                  key={
                    story.id
                  }
                  href={
                    `/stories/${story.slug}`
                  }
                >

                  <div
                    className="cardImage"
                    style={{
                      backgroundImage:
                        `url("${story.heroImage}")`,
                    }}
                  />

                  <small>
                    {story.eyebrow}
                  </small>

                  <h2>
                    {story.titleKo}
                  </h2>

                  <b>
                    {story.titleEn}
                  </b>

                  <p>
                    {story.summary}
                  </p>

                </Link>

              )
            )}

          </div>

        </section>

      )}

    </main>
  );
}