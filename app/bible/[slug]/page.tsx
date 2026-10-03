import fs
  from "node:fs";


import path
  from "node:path";


import {
  notFound,
} from "next/navigation";


import Hero
  from "../../../components/Hero";


import RelationCards
  from "../../../components/RelationCards";


import {
  getNode,
} from "../../../data/content";


import {
  getBibleCatalogBook,
  getContentBookSlug,
} from "../../../data/bible/catalog";




/* =====================================================
   TYPES
   ===================================================== */


type BookSection = {
  number: string;
  title: string;
  scripture: string;
  description: string;
};




type RelationTargetType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";




type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_PERIOD"
  | "RELATED_BOOK"
  | "RELATED_STORY";




type BibleRelation = {
  targetType: RelationTargetType;
  targetSlug: string;
  relationType: RelationType;
  label: string;
};




type BibleBook = {
  slug: string;
  titleKo: string;
  titleEn: string;
  eyebrow: string;
  summary: string;
  heroImage: string;
  overview?: string;
  biblicalContext?: string;
  scripture: string[];
  bookSections: BookSection[];
  relations: BibleRelation[];
};




type BiblePackageNode =
  Record<
    string,
    unknown
  >;




type BiblePackage = {
  nodes?: BiblePackageNode[];
};




/* =====================================================
   NORMALIZERS
   ===================================================== */


function normalizeString(
  value: unknown
): string {


  return typeof value ===
    "string"
      ? value.trim()
      : "";


}




function normalizeScripture(
  value: unknown
): string[] {


  if (
    !Array.isArray(
      value
    )
  ) {


    return [];


  }




  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
          "string"
    )
    .map(
      (
        item
      ) =>
        item.trim()
    )
    .filter(
      Boolean
    );


}




function normalizeBookSections(
  value: unknown
): BookSection[] {


  if (
    !Array.isArray(
      value
    )
  ) {


    return [];


  }




  return value
    .map(
      (
        item,
        index
      ): BookSection | null => {


        if (
          typeof item !==
            "object" ||
          item ===
            null
        ) {


          return null;


        }




        const data =
          item as
            Record<
              string,
              unknown
            >;




        const title =
          normalizeString(
            data.title
          );




        const scripture =
          normalizeString(
            data.scripture
          );




        const description =
          normalizeString(
            data.description
          );




        if (
          !title &&
          !scripture &&
          !description
        ) {


          return null;


        }




        return {
          number:
            normalizeString(
              data.number
            ) ||
            String(
              index + 1
            ).padStart(
              2,
              "0"
            ),


          title,


          scripture,


          description,
        };


      }
    )
    .filter(
      (
        item
      ): item is BookSection =>
        item !== null
    );


}




const validTargetTypes =
  new Set<
    RelationTargetType
  >([
    "story",
    "person",
    "place",
    "period",
    "book",
    "visual",
  ]);




const validRelationTypes =
  new Set<
    RelationType
  >([
    "RELATED_PERSON",
    "RELATED_PLACE",
    "RELATED_PERIOD",
    "RELATED_BOOK",
    "RELATED_STORY",
  ]);




function normalizeRelations(
  value: unknown
): BibleRelation[] {


  if (
    !Array.isArray(
      value
    )
  ) {


    return [];


  }




  const normalized =
    value
      .map(
        (
          item
        ): BibleRelation | null => {


          if (
            typeof item !==
              "object" ||
            item ===
              null
          ) {


            return null;


          }




          const data =
            item as
              Record<
                string,
                unknown
              >;




          const targetType =
            normalizeString(
              data.targetType
            ) as
              RelationTargetType;




          const targetSlug =
            normalizeString(
              data.targetSlug
            )
              .toLowerCase();




          const relationType =
            normalizeString(
              data.relationType
            ) as
              RelationType;




          const label =
            normalizeString(
              data.label
            );




          if (
            !validTargetTypes.has(
              targetType
            ) ||
            !validRelationTypes.has(
              relationType
            ) ||
            !targetSlug
          ) {


            return null;


          }




          return {
            targetType,
            targetSlug,
            relationType,
            label,
          };


        }
      )
      .filter(
        (
          item
        ): item is BibleRelation =>
          item !== null
      );




  return Array.from(
    new Map(
      normalized.map(
        (
          relation
        ) => [
          `${relation.targetType}__${relation.targetSlug}`,
          relation,
        ]
      )
    ).values()
  );


}




/* =====================================================
   JSON PACKAGE LOADER
   ===================================================== */


function getBiblePackageBook(
  routeSlugValue: string
): BibleBook | null {


  const routeSlug =
    routeSlugValue
      .trim()
      .toLowerCase();




  if (
    !routeSlug
  ) {


    return null;


  }




  const filePath =
    path.join(
      process.cwd(),
      "data",
      "bible",
      "books",
      `${routeSlug}.json`
    );




  if (
    !fs.existsSync(
      filePath
    )
  ) {


    return null;


  }




  try {


    const raw =
      fs.readFileSync(
        filePath,
        "utf8"
      );




    const parsed =
      JSON.parse(
        raw
      ) as BiblePackage;




    const nodes =
      Array.isArray(
        parsed.nodes
      )
        ? parsed.nodes
        : [];




    const bookNode =
      nodes.find(
        (
          node
        ) =>
          normalizeString(
            node.type
          ) ===
            "book" &&
          normalizeString(
            node.slug
          )
            .toLowerCase() ===
            routeSlug
      );




    if (
      !bookNode
    ) {


      return null;


    }




    return {


      slug:
        normalizeString(
          bookNode.slug
        ) ||
        routeSlug,


      titleKo:
        normalizeString(
          bookNode.titleKo
        ),


      titleEn:
        normalizeString(
          bookNode.titleEn
        ),


      eyebrow:
        normalizeString(
          bookNode.eyebrow
        ) ||
        "BIBLE",


      summary:
        normalizeString(
          bookNode.summary
        ),


      heroImage:
        normalizeString(
          bookNode.heroImage
        ) ||
        "/assets/scraptura-home-clean.jpg",


      overview:
        normalizeString(
          bookNode.overview
        ) ||
        undefined,


      biblicalContext:
        normalizeString(
          bookNode.biblicalContext
        ) ||
        undefined,


      scripture:
        normalizeScripture(
          bookNode.scripture
        ),


      bookSections:
        normalizeBookSections(
          bookNode.bookSections
        ),


      relations:
        normalizeRelations(
          bookNode.relations
        ),


    };


  }
  catch (
    error
  ) {


    console.error(
      `[SCRAPTURA] Failed to read Bible package: ${routeSlug}`,
      error
    );




    return null;


  }


}




/* =====================================================
   LEGACY CONTENT.TS FALLBACK
   ===================================================== */


function getLegacyBook(
  routeSlugValue: string
): BibleBook | null {


  const routeSlug =
    routeSlugValue
      .trim()
      .toLowerCase();




  if (
    !routeSlug
  ) {


    return null;


  }




  const contentSlug =
    getContentBookSlug(
      routeSlug
    );




  const node =
    getNode(
      "book",
      contentSlug
    );




  if (
    !node
  ) {


    return null;


  }




  return {


    slug:
      node.slug,


    titleKo:
      node.titleKo,


    titleEn:
      node.titleEn,


    eyebrow:
      node.eyebrow ||
      "BIBLE",


    summary:
      node.summary,


    heroImage:
      node.heroImage ||
      "/assets/scraptura-home-clean.jpg",


    overview:
      node.overview,


    biblicalContext:
      node.biblicalContext,


    scripture:
      node.scripture ??
      [],


    bookSections:
      node.bookSections ??
      [],


    relations:
      (
        node.relations ??
        []
      ) as
        BibleRelation[],


  };


}




/* =====================================================
   66 BOOK CATALOG FALLBACK
   ===================================================== */


function getCatalogBook(
  routeSlugValue: string
): BibleBook | null {


  const routeSlug =
    routeSlugValue
      .trim()
      .toLowerCase();




  if (
    !routeSlug
  ) {


    return null;


  }




  const catalogBook =
    getBibleCatalogBook(
      routeSlug
    );




  if (
    !catalogBook
  ) {


    return null;


  }




  const catalog =
    catalogBook as
      unknown as
        Record<
          string,
          unknown
        >;




  return {


    slug:
      normalizeString(
        catalog.slug
      ) ||
      routeSlug,


    titleKo:
      normalizeString(
        catalog.titleKo
      ),


    titleEn:
      normalizeString(
        catalog.titleEn
      ),


    eyebrow:
      normalizeString(
        catalog.eyebrow
      ) ||
      "BIBLE",


    summary:
      normalizeString(
        catalog.summary
      ),


    heroImage:
      normalizeString(
        catalog.heroImage
      ) ||
      "/assets/scraptura-home-clean.jpg",


    overview:
      normalizeString(
        catalog.overview
      ) ||
      undefined,


    biblicalContext:
      normalizeString(
        catalog.biblicalContext
      ) ||
      undefined,


    scripture:
      normalizeScripture(
        catalog.scripture
      ),


    bookSections:
      normalizeBookSections(
        catalog.bookSections
      ),


    relations:
      normalizeRelations(
        catalog.relations
      ),


  };


}




/* =====================================================
   FINAL BOOK RESOLVER
   ===================================================== */


function getBibleBook(
  routeSlugValue: string
): BibleBook | null {


  /*
   * 1. 신규 JSON package
   * 2. 기존 content.ts
   * 3. 66권 catalog
   *
   * Firestore 동기화 여부와 상관없이
   * JSON 파일만 추가하면 즉시 표시됩니다.
   */


  return (
    getBiblePackageBook(
      routeSlugValue
    ) ??
    getLegacyBook(
      routeSlugValue
    ) ??
    getCatalogBook(
      routeSlugValue
    )
  );


}




/* =====================================================
   PAGE
   ===================================================== */


export default async function Page({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}) {


  const {
    slug,
  } =
    await params;




  const book =
    getBibleBook(
      slug
    );




  if (
    !book
  ) {


    return notFound();


  }




  return (


    <main>


      <Hero
        eyebrow={
          book.eyebrow
        }
        titleKo={
          book.titleKo
        }
        titleEn={
          book.titleEn
        }
        summary={
          book.summary
        }
        image={
          book.heroImage
        }
      />




      <div
        className="contentWrap"
      >


        <section
          className="overview"
        >


          <small>
            OVERVIEW
          </small>




          <h3>
            {book.titleKo} 탐험
          </h3>




          <p>
            {
              book.overview ??
              book.summary
            }
          </p>


        </section>




        {
          book.biblicalContext &&
          (


            <section
              className="journey"
            >


              <small>
                BIBLICAL CONTEXT
              </small>




              <h3>
                책의 흐름과 배경
              </h3>




              <p>
                {
                  book.biblicalContext
                }
              </p>


            </section>


          )
        }




        {
          book
            .bookSections
            .length >
          0 &&
          (


            <section
              className=
                "journey characterJourney"
            >


              <div
                className=
                  "characterJourneyHeader"
              >


                <small>
                  BOOK JOURNEY
                </small>




                <h3>
                  {
                    book.titleKo
                  }의 주요 흐름
                </h3>




                <p>
                  성경의 장별 흐름을 따라
                  주요 인물과 사건이 어떻게
                  연결되는지 살펴봅니다.
                </p>


              </div>




              <div
                className=
                  "characterJourneyList"
              >


                {
                  book.bookSections.map(
                    (
                      section,
                      index
                    ) => (


                      <article
                        className=
                          "characterStage"


                        key={
                          `${section.number}-${index}`
                        }
                      >


                        <div
                          className=
                            "characterStageNumber"
                        >
                          {
                            section.number
                          }
                        </div>




                        <div
                          className=
                            "characterStageContent"
                        >


                          <small>
                            {
                              section.scripture
                            }
                          </small>




                          <h4>
                            {
                              section.title
                            }
                          </h4>




                          <p>
                            {
                              section.description
                            }
                          </p>


                        </div>


                      </article>


                    )
                  )
                }


              </div>


            </section>


          )
        }




        {
          book
            .scripture
            .length >
          0 &&
          (


            <section
              className="journey"
            >


              <small>
                SCRIPTURE
              </small>




              <h3>
                본문 범위
              </h3>




              <p>
                {
                  book.scripture.join(
                    " · "
                  )
                }
              </p>


            </section>


          )
        }




        {
          book
            .relations
            .length >
          0 &&
          (


            <RelationCards
              items={
                book.relations
              }
            />


          )
        }


      </div>


    </main>


  );


}