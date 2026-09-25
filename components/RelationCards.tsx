import Link from "next/link";

import type {
  Relation,
} from "../data/content";


const route:
  Record<
    string,
    string
  > = {

  person:
    "people",

  place:
    "places",

  period:
    "timeline",

  book:
    "bible",

  story:
    "stories",
};


const groups = [
  {
    type:
      "person",

    label:
      "PEOPLE",

    description:
      "관련 인물",
  },

  {
    type:
      "place",

    label:
      "PLACES",

    description:
      "관련 장소",
  },

  {
    type:
      "story",

    label:
      "STORIES",

    description:
      "관련 성경 이야기",
  },

  {
    type:
      "period",

    label:
      "PERIOD",

    description:
      "관련 시대",
  },

  {
    type:
      "book",

    label:
      "SCRIPTURE",

    description:
      "관련 성경 본문",
  },
];


/*
 * =====================================
 * DUPLICATE RELATION REMOVE
 * =====================================
 *
 * person + david
 * person + david
 *
 * 처럼 동일한 관계가 여러 번 들어와도
 * 하나만 남깁니다.
 */

function removeDuplicateRelations(
  items: Relation[]
) {

  const relationMap =
    new Map<
      string,
      Relation
    >();


  items.forEach(
    (
      item
    ) => {

      /*
       * 잘못된 Relation은
       * 공개 UI에 표시하지 않습니다.
       */

      if (
        !item.targetType ||
        !item.targetSlug
      ) {
        return;
      }


      const key =
        `${item.targetType}__${item.targetSlug}`;


      /*
       * 같은 key가 이미 있다면
       * 기존 값을 유지합니다.
       */

      if (
        !relationMap.has(
          key
        )
      ) {

        relationMap.set(
          key,
          item
        );

      }

    }
  );


  return Array.from(
    relationMap.values()
  );
}


export default function RelationCards({
  items = [],
}: {
  items?: Relation[];
}) {

  /*
   * =====================================
   * RELATION DEDUPLICATION
   * =====================================
   */

  const uniqueItems =
    removeDuplicateRelations(
      items
    );


  return (
    <section
      className=
        "connectWorld"
    >

      {/* =================================
          HEADER
          ================================= */}

      <div
        className=
          "connectWorldHeader"
      >

        <small>
          CONNECT THE WORLD
        </small>


        <h3>
          성경의 세계를 계속 탐험하세요
        </h3>


        <p>
          하나의 이야기에서 인물,
          장소, 시대와 성경 본문으로
          탐험을 이어갈 수 있습니다.
        </p>

      </div>


      {/* =================================
          GROUPS
          ================================= */}

      <div
        className=
          "connectWorldGrid"
      >

        {groups.map(
          (
            group
          ) => {

            /*
             * 중복 제거된 Relation에서
             * 현재 그룹만 필터링
             */

            const groupItems =
              uniqueItems.filter(
                (
                  item
                ) =>
                  item.targetType ===
                  group.type
              );


            /*
             * 해당 그룹의 Relation이
             * 하나도 없으면 그룹 숨김
             */

            if (
              groupItems.length ===
              0
            ) {

              return null;

            }


            return (
              <div
                className=
                  "connectGroup"

                key={
                  group.type
                }
              >

                {/* GROUP TITLE */}

                <div
                  className=
                    "connectGroupTitle"
                >

                  <small>
                    {group.label}
                  </small>


                  <span>
                    {group.description}
                  </span>

                </div>


                {/* LINKS */}

                <div
                  className=
                    "connectLinks"
                >

                  {groupItems.map(
                    (
                      item
                    ) => {

                      const baseRoute =
                        route[
                          item.targetType
                        ];


                      /*
                       * 지원되지 않는
                       * targetType 방어
                       */

                      if (
                        !baseRoute
                      ) {

                        return null;

                      }


                      return (
                        <Link
                          key={
                            `${item.targetType}-${item.targetSlug}`
                          }

                          href={
                            `/${baseRoute}/${item.targetSlug}`
                          }

                          className=
                            "connectLink"
                        >

                          <span>
                            {item.label}
                          </span>


                          <b>
                            →
                          </b>

                        </Link>
                      );

                    }
                  )}

                </div>

              </div>
            );

          }
        )}

      </div>

    </section>
  );
}