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


type PlaceRecord = {
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


export default function PlacesArchiveFirebase() {

  const [
    places,
    setPlaces,
  ] =
    useState<PlaceRecord[]>([]);


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


    async function loadPlaces() {

      try {

        setLoading(true);
        setErrorMessage("");


        /*
         * Firestore Rules 대응
         *
         * published 조건은
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
              ): PlaceRecord | null => {

                const data =
                  document.data();


                /*
                 * PLACES만 사용
                 */

                if (
                  data.type !==
                  "place"
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
                    "place",

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
              ): item is PlaceRecord =>
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


        setPlaces(
          records
        );


      } catch (error) {

        console.error(
          "[PlacesArchiveFirebase]",
          error
        );


        if (!active) {
          return;
        }


        setErrorMessage(
          "장소 데이터를 불러오지 못했습니다."
        );


      } finally {

        if (active) {
          setLoading(false);
        }
      }
    }


    void loadPlaces();


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
        PLACES
      </h1>

      <p>
        성경의 사건이 펼쳐진 장소를 따라
        인물과 이야기, 시대와 성경 본문을
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
          className="placesArchive"
        >

          <div
            className="placesSectionHead"
          >

            <small>
              PLACES ARCHIVE
            </small>

            <h2>
              장소 기록을 불러오고 있습니다
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
          className="placesArchive"
        >

          <div
            className="placesSectionHead"
          >

            <small>
              PLACES ARCHIVE
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
    places.length === 0
  ) {
    return (
      <main>

        {head}

        <section
          className="placesArchive"
        >

          <div
            className="placesSectionHead"
          >

            <small>
              PLACES ARCHIVE
            </small>

            <h2>
              등록된 장소가 없습니다
            </h2>

            <p>
              Published 상태의 장소 콘텐츠를
              등록해주세요.
            </p>

          </div>

        </section>

      </main>
    );
  }


  /*
   * =====================================
   * FEATURED PLACE
   * =====================================
   *
   * 기존 PLACES 디자인과 동일하게
   * Valley of Elah를 대표 장소로 사용
   */

  const featured =
    places.find(
      (place) =>
        place.slug ===
        "valley-of-elah"
    ) ??
    places[0];


  const rest =
    places.filter(
      (place) =>
        place.slug !==
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
          FEATURED PLACE
      ================================= */}

      <section
        className="placesFeaturedWrap"
      >

        <div
          className="placesSectionHead"
        >

          <small>
            EXPLORE A PLACE
          </small>

          <h2>
            성경의 사건이 펼쳐진 공간을
            탐험하세요
          </h2>

          <p>
            장소를 중심으로 관련 인물과 사건,
            시대와 성경 본문을 연결하며 성경의
            공간적 배경을 살펴봅니다.
          </p>

        </div>


        <Link
          className="placesFeatured"
          href={
            `/places/${featured.slug}`
          }
        >

          <div
            className="placesFeaturedImage"
            style={{
              backgroundImage:
                `url("${featured.heroImage}")`,
            }}
          >

            <div
              className="placesFeaturedShade"
            />


            <div
              className="placesFeaturedContent"
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
                EXPLORE PLACE →
              </span>

            </div>

          </div>

        </Link>

      </section>


      {/* =================================
          PLACES ARCHIVE
      ================================= */}

      {rest.length > 0 && (

        <section
          className="placesArchive"
        >

          <div
            className="placesSectionHead"
          >

            <small>
              PLACES ARCHIVE
            </small>

            <h2>
              성경 속 장소들을 계속
              탐험하세요
            </h2>

            <p>
              주요 도시와 전장의 기록을 따라
              사건이 일어난 공간의 관계를
              발견할 수 있습니다.
            </p>

          </div>


          <div
            className="cardGrid"
          >

            {rest.map(
              (place) => (

                <Link
                  className="archiveCard"
                  key={
                    place.id
                  }
                  href={
                    `/places/${place.slug}`
                  }
                >

                  <div
                    className="cardImage"
                    style={{
                      backgroundImage:
                        `url("${place.heroImage}")`,
                    }}
                  />

                  <small>
                    {place.eyebrow}
                  </small>

                  <h2>
                    {place.titleKo}
                  </h2>

                  <b>
                    {place.titleEn}
                  </b>

                  <p>
                    {place.summary}
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