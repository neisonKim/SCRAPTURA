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


type PersonRecord = {
  id: string;

  type: string;

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  status: string;

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


export default function PeopleArchiveFirebase() {

  const [
    people,
    setPeople,
  ] = useState<PersonRecord[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {

    let active = true;


    async function loadPeople() {

      try {

        setLoading(true);
        setErrorMessage("");


        /*
         * Firestore Rules는 필터가 아니므로
         * published 조건을 쿼리에 포함합니다.
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
              ): PersonRecord | null => {

                const data =
                  document.data();


                /*
                 * PEOPLE만 선택
                 */

                if (
                  data.type !==
                  "person"
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

                  type:
                    "person",

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

                  status:
                    normalizeString(
                      data.status
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
              ): item is PersonRecord =>
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
                  a.titleKo
                    .localeCompare(
                      b.titleKo,
                      "ko"
                    )
                );
              }
            );


        setPeople(
          records
        );


      } catch (error) {

        console.error(
          "[PeopleArchiveFirebase]",
          error
        );


        if (!active) {
          return;
        }


        setErrorMessage(
          "인물 데이터를 불러오지 못했습니다."
        );


      } finally {

        if (active) {
          setLoading(false);
        }
      }
    }


    void loadPeople();


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
        PEOPLE
      </h1>

      <p>
        성경 속 인물의 삶과 관계를 따라 이야기,
        장소, 시대와 성경 본문을 탐험하세요.
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
          className="peopleArchive"
        >
          <div
            className="peopleSectionHead"
          >
            <small>
              PEOPLE ARCHIVE
            </small>

            <h2>
              인물 기록을 불러오고 있습니다
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
          className="peopleArchive"
        >
          <div
            className="peopleSectionHead"
          >
            <small>
              PEOPLE ARCHIVE
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
    people.length === 0
  ) {
    return (
      <main>

        {head}

        <section
          className="peopleArchive"
        >
          <div
            className="peopleSectionHead"
          >
            <small>
              PEOPLE ARCHIVE
            </small>

            <h2>
              등록된 인물이 없습니다
            </h2>

            <p>
              Published 상태의 인물 콘텐츠를
              등록해주세요.
            </p>
          </div>
        </section>

      </main>
    );
  }


  /*
   * =====================================
   * FEATURED
   * =====================================
   *
   * 기존 PEOPLE 화면과 동일하게
   * David를 대표 콘텐츠로 사용합니다.
   */

  const featured =
    people.find(
      (person) =>
        person.slug ===
        "david"
    ) ??
    people[0];


  const rest =
    people.filter(
      (person) =>
        person.slug !==
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
          FEATURED PERSON
      ================================= */}

      <section
        className="peopleFeaturedWrap"
      >

        <div
          className="peopleSectionHead"
        >
          <small>
            EXPLORE A PERSON
          </small>

          <h2>
            인물의 여정을 따라 성경의 세계를
            탐험하세요
          </h2>

          <p>
            한 인물의 삶을 따라가며 관련 이야기,
            장소, 시대와 성경 본문으로 탐험을
            이어갈 수 있습니다.
          </p>
        </div>


        <Link
          className="peopleFeatured"
          href={
            `/people/${featured.slug}`
          }
        >

          <div
            className="peopleFeaturedImage"
            style={{
              backgroundImage:
                `url("${featured.heroImage}")`,
            }}
          />


          <div
            className="peopleFeaturedContent"
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
              EXPLORE PERSON →
            </span>

          </div>

        </Link>

      </section>


      {/* =================================
          PEOPLE ARCHIVE
      ================================= */}

      {rest.length > 0 && (

        <section
          className="peopleArchive"
        >

          <div
            className="peopleSectionHead"
          >

            <small>
              PEOPLE ARCHIVE
            </small>

            <h2>
              성경 속 인물들을 만나보세요
            </h2>

            <p>
              각 인물의 기록에서 다른 인물과 사건,
              장소로 연결되는 관계를 발견할 수
              있습니다.
            </p>

          </div>


          <div
            className="cardGrid"
          >

            {rest.map(
              (person) => (

                <Link
                  className="archiveCard"
                  key={
                    person.id
                  }
                  href={
                    `/people/${person.slug}`
                  }
                >

                  <div
                    className="cardImage"
                    style={{
                      backgroundImage:
                        `url("${person.heroImage}")`,
                    }}
                  />

                  <small>
                    {person.eyebrow}
                  </small>

                  <h2>
                    {person.titleKo}
                  </h2>

                  <b>
                    {person.titleEn}
                  </b>

                  <p>
                    {person.summary}
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