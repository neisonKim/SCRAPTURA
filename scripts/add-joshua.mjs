import fs from "node:fs";
import path from "node:path";


const contentPath = path.join(
  process.cwd(),
  "data",
  "content.ts"
);

const backupPath = path.join(
  process.cwd(),
  "data",
  "content.before-joshua.ts"
);


/* =====================================================
   FILE CHECK
   ===================================================== */

if (!fs.existsSync(contentPath)) {
  throw new Error(
    "data/content.ts 파일을 찾을 수 없습니다."
  );
}


let source = fs.readFileSync(
  contentPath,
  "utf8"
);


/* =====================================================
   BACKUP
   ===================================================== */

fs.writeFileSync(
  backupPath,
  source,
  "utf8"
);

console.log(
  "백업 생성:",
  backupPath
);


/* =====================================================
   REGEX ESCAPE
   ===================================================== */

function escapeRegex(
  value
) {

  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


/* =====================================================
   STRICT NODE FINDER
   ===================================================== */

function findNodeRange(
  fullSource,
  slug
) {

  const escapedSlug =
    escapeRegex(
      slug
    );


  const slugRegex =
    new RegExp(
      `^[ \\t]*slug:\\s*"${escapedSlug}"\\s*,?\\s*$`,
      "m"
    );


  const match =
    slugRegex.exec(
      fullSource
    );


  if (!match) {
    return null;
  }


  const slugIndex =
    match.index;


  const start =
    fullSource.lastIndexOf(
      "\n  {",
      slugIndex
    );


  if (start === -1) {

    throw new Error(
      `${slug} 노드 시작 위치를 찾지 못했습니다.`
    );
  }


  const endMarker =
    "\n  },";


  const end =
    fullSource.indexOf(
      endMarker,
      slugIndex
    );


  if (end === -1) {

    throw new Error(
      `${slug} 노드 종료 위치를 찾지 못했습니다.`
    );
  }


  return {
    start,

    end:
      end +
      endMarker.length,

    content:
      fullSource.slice(
        start,
        end +
          endMarker.length
      ),
  };
}


/* =====================================================
   NODE EXISTS
   ===================================================== */

function nodeExists(
  fullSource,
  slug
) {

  return Boolean(
    findNodeRange(
      fullSource,
      slug
    )
  );
}


/* =====================================================
   RELATION CHECK
   ===================================================== */

function hasRelation(
  nodeContent,
  targetSlug
) {

  const escaped =
    escapeRegex(
      targetSlug
    );


  return new RegExp(
    `targetSlug\\s*:\\s*"${escaped}"`
  ).test(
    nodeContent
  );
}


/* =====================================================
   ADD RELATION
   ===================================================== */

function addRelation(
  fullSource,
  nodeSlug,
  relation
) {

  const node =
    findNodeRange(
      fullSource,
      nodeSlug
    );


  if (!node) {

    console.log(
      `${nodeSlug} 없음 → 관계 추가 생략`
    );

    return fullSource;
  }


  if (
    hasRelation(
      node.content,
      relation.targetSlug
    )
  ) {

    console.log(
      `${nodeSlug} → ${relation.targetSlug} 이미 존재`
    );

    return fullSource;
  }


  const relationsStart =
    node.content.indexOf(
      "relations: ["
    );


  if (
    relationsStart === -1
  ) {

    console.log(
      `${nodeSlug}에 relations 없음 → 관계 추가 생략`
    );

    return fullSource;
  }


  const relationsEnd =
    node.content.indexOf(
      "\n    ],",
      relationsStart
    );


  if (
    relationsEnd === -1
  ) {

    throw new Error(
      `${nodeSlug} relations 종료 위치를 찾지 못했습니다.`
    );
  }


  const relationCode = `

      {
        targetType: "${relation.targetType}",
        targetSlug: "${relation.targetSlug}",
        relationType: "${relation.relationType}",
        label: "${relation.label}",
      },`;


  const updatedNode =
    node.content.slice(
      0,
      relationsEnd
    ) +
    relationCode +
    node.content.slice(
      relationsEnd
    );


  console.log(
    `${nodeSlug} → ${relation.targetSlug} 관계 추가`
  );


  return (
    fullSource.slice(
      0,
      node.start
    ) +
    updatedNode +
    fullSource.slice(
      node.end
    )
  );
}


/* =====================================================
   REQUIRED NODE
   ===================================================== */

const mosesBefore =
  findNodeRange(
    source,
    "moses"
  );


if (!mosesBefore) {

  throw new Error(
    'PERSON 노드 slug: "moses"를 찾지 못했습니다.'
  );
}


if (
  !mosesBefore.content.includes(
    'type: "person"'
  )
) {

  throw new Error(
    "Moses 노드의 type이 person이 아닙니다."
  );
}


console.log(
  "Moses 실제 Person 노드 확인"
);


/* =====================================================
   CREATE JOSHUA
   ===================================================== */

let joshua =
  findNodeRange(
    source,
    "joshua"
  );


if (!joshua) {

  const relationItems = [];


  /*
   * MOSES
   */

  relationItems.push({
    targetType:
      "person",

    targetSlug:
      "moses",

    relationType:
      "RELATED_PERSON",

    label:
      "모세",
  });


  /*
   * EXODUS
   */

  if (
    nodeExists(
      source,
      "exodus"
    )
  ) {

    relationItems.push({
      targetType:
        "book",

      targetSlug:
        "exodus",

      relationType:
        "RELATED_BOOK",

      label:
        "출애굽기",
    });
  }


  /*
   * SINAI
   */

  if (
    nodeExists(
      source,
      "sinai"
    )
  ) {

    relationItems.push({
      targetType:
        "place",

      targetSlug:
        "sinai",

      relationType:
        "RELATED_PLACE",

      label:
        "시내산",
    });
  }


  /*
   * CANAAN
   */

  if (
    nodeExists(
      source,
      "canaan"
    )
  ) {

    relationItems.push({
      targetType:
        "place",

      targetSlug:
        "canaan",

      relationType:
        "RELATED_PLACE",

      label:
        "가나안",
    });
  }


  /*
   * JERICHO
   */

  if (
    nodeExists(
      source,
      "jericho"
    )
  ) {

    relationItems.push({
      targetType:
        "place",

      targetSlug:
        "jericho",

      relationType:
        "RELATED_PLACE",

      label:
        "여리고",
    });
  }


  /*
   * BOOK — JOSHUA
   *
   * 현재 Book Node가 있을 때만 연결
   */

  const bookJoshuaExists =
    nodeExists(
      source,
      "book-of-joshua"
    );


  if (
    bookJoshuaExists
  ) {

    relationItems.push({
      targetType:
        "book",

      targetSlug:
        "book-of-joshua",

      relationType:
        "RELATED_BOOK",

      label:
        "여호수아",
    });
  }


  const relationCode =
    relationItems
      .map(
        (
          relation
        ) => `      {
        targetType: "${relation.targetType}",
        targetSlug: "${relation.targetSlug}",
        relationType: "${relation.relationType}",
        label: "${relation.label}",
      },`
      )
      .join(
        "\n\n"
      );


  const joshuaNode = `

  /* =====================================================
     PERSON — JOSHUA
     ===================================================== */

  {
    type: "person",

    slug: "joshua",

    titleKo: "여호수아",

    titleEn: "Joshua",

    eyebrow:
      "PEOPLE · EXODUS · CANAAN JOURNEY",

    summary:
      "모세와 함께 광야 시대를 지나고 이후 이스라엘 공동체를 이끌어 요단강을 건너 가나안으로 들어가는 인물입니다.",

    overview:
      "여호수아는 출애굽기에서 아말렉과의 전투를 지휘하는 인물로 처음 중요한 역할을 맡습니다. 이후 모세를 보좌하며 광야 시대를 지나고, 가나안 정탐 사건에서도 등장합니다. 모세의 마지막 시기에는 그의 후계자로 세워지고, 여호수아서에서는 이스라엘 공동체를 이끌고 요단강을 건너 가나안으로 들어갑니다.",

    biblicalContext:
      "SCRAPTURA에서 여호수아는 출애굽과 광야 시대를 가나안 정착 이야기로 연결하는 핵심 Person Node입니다. 모세의 인물 여정에서 시작해 이후 요단강, 여리고, 가나안과 같은 장소 및 사건으로 탐험을 확장할 수 있습니다.",


    /* =================================================
       CHARACTER JOURNEY
       ================================================= */

    characterJourney: [

      {
        number:
          "01",

        title:
          "THE BATTLE WITH AMALEK",

        scripture:
          "Exodus 17:8–16",

        description:
          "여호수아는 아말렉과의 전투에서 이스라엘 사람들을 이끄는 인물로 등장합니다.",
      },


      {
        number:
          "02",

        title:
          "WITH MOSES",

        scripture:
          "Exodus 24:12–14",

        description:
          "여호수아는 모세와 함께 시내산 이야기의 일부에 등장하며 모세를 보좌하는 인물로 묘사됩니다.",
      },


      {
        number:
          "03",

        title:
          "THE TENT OF MEETING",

        scripture:
          "Exodus 33:7–11",

        description:
          "출애굽기에서는 여호수아가 모세와 회막을 둘러싼 장면에서도 등장합니다.",
      },


      {
        number:
          "04",

        title:
          "THE TWELVE SPIES",

        scripture:
          "Numbers 13:1–16",

        description:
          "여호수아는 가나안 땅을 정탐하기 위해 선택된 열두 명 가운데 한 사람으로 파견됩니다.",
      },


      {
        number:
          "05",

        title:
          "JOSHUA & CALEB",

        scripture:
          "Numbers 14:1–10",

        description:
          "정탐 이후 여호수아와 갈렙은 다른 정탐꾼들과 다른 입장을 보이며 공동체 앞에 섭니다.",
      },


      {
        number:
          "06",

        title:
          "THE SUCCESSOR",

        scripture:
          "Numbers 27:15–23",

        description:
          "모세의 뒤를 이어 공동체를 이끌 인물로 여호수아가 세워지는 장면이 기록됩니다.",
      },


      {
        number:
          "07",

        title:
          "BE STRONG & COURAGEOUS",

        scripture:
          "Deuteronomy 31:1–8",

        description:
          "모세의 마지막 시기에 여호수아는 이스라엘 공동체를 이끌어 다음 단계로 나아갈 인물로 다시 확인됩니다.",
      },


      {
        number:
          "08",

        title:
          "CROSSING THE JORDAN",

        scripture:
          "Joshua 3–4",

        description:
          "여호수아의 지도 아래 이스라엘 공동체가 요단강을 건너며 가나안 진입이 본격적으로 시작됩니다.",
      },


      {
        number:
          "09",

        title:
          "JERICHO",

        scripture:
          "Joshua 6",

        description:
          "여리고 사건은 여호수아서 초기 가나안 진입 서사의 대표적인 장면 가운데 하나입니다.",
      },


      {
        number:
          "10",

        title:
          "THE COVENANT AT SHECHEM",

        scripture:
          "Joshua 24",

        description:
          "여호수아의 이야기 후반부에는 세겜에서 이스라엘 공동체가 모이고 언약을 재확인하는 장면이 기록됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Exodus 17:8–16",
      "Exodus 24:12–14",
      "Exodus 33:7–11",
      "Numbers 13–14",
      "Numbers 27:15–23",
      "Deuteronomy 31",
      "Joshua 1–24",
    ],


    relations: [

${relationCode}

    ],

  },
`;


  const getNodePosition =
    source.lastIndexOf(
      "export const getNode"
    );


  if (
    getNodePosition === -1
  ) {

    throw new Error(
      "export const getNode를 찾지 못했습니다."
    );
  }


  const beforeGetNode =
    source.slice(
      0,
      getNodePosition
    );


  const nodesEnd =
    beforeGetNode.lastIndexOf(
      "];"
    );


  if (
    nodesEnd === -1
  ) {

    throw new Error(
      "nodes 배열 끝을 찾지 못했습니다."
    );
  }


  source =
    source.slice(
      0,
      nodesEnd
    ) +
    joshuaNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "PERSON — JOSHUA 실제 Node 추가"
  );

}
else {

  console.log(
    "PERSON — JOSHUA 이미 존재"
  );
}


/* =====================================================
   VERIFY JOSHUA
   ===================================================== */

joshua =
  findNodeRange(
    source,
    "joshua"
  );


if (!joshua) {

  throw new Error(
    "Joshua 실제 노드 생성 실패"
  );
}


/* =====================================================
   MOSES → JOSHUA
   ===================================================== */

source = addRelation(
  source,
  "moses",
  {
    targetType:
      "person",

    targetSlug:
      "joshua",

    relationType:
      "RELATED_PERSON",

    label:
      "여호수아",
  }
);


/* =====================================================
   EXODUS → JOSHUA
   ===================================================== */

if (
  nodeExists(
    source,
    "exodus"
  )
) {

  source = addRelation(
    source,
    "exodus",
    {
      targetType:
        "person",

      targetSlug:
        "joshua",

      relationType:
        "RELATED_PERSON",

      label:
        "여호수아",
    }
  );
}


/* =====================================================
   SINAI → JOSHUA
   ===================================================== */

if (
  nodeExists(
    source,
    "sinai"
  )
) {

  source = addRelation(
    source,
    "sinai",
    {
      targetType:
        "person",

      targetSlug:
        "joshua",

      relationType:
        "RELATED_PERSON",

      label:
        "여호수아",
    }
  );
}


/* =====================================================
   CANAAN → JOSHUA
   ===================================================== */

if (
  nodeExists(
    source,
    "canaan"
  )
) {

  source = addRelation(
    source,
    "canaan",
    {
      targetType:
        "person",

      targetSlug:
        "joshua",

      relationType:
        "RELATED_PERSON",

      label:
        "여호수아",
    }
  );
}


/* =====================================================
   JERICHO → JOSHUA
   ===================================================== */

if (
  nodeExists(
    source,
    "jericho"
  )
) {

  source = addRelation(
    source,
    "jericho",
    {
      targetType:
        "person",

      targetSlug:
        "joshua",

      relationType:
        "RELATED_PERSON",

      label:
        "여호수아",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalMoses =
  findNodeRange(
    source,
    "moses"
  );


if (
  !finalJoshua ||
  !finalMoses
) {

  throw new Error(
    "최종 Joshua/Moses 검증 실패"
  );
}


const validations = [

  [
    "Joshua actual slug",

    /^[ \t]*slug:\s*"joshua"\s*,?\s*$/m
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Joshua Type",

    finalJoshua.content.includes(
      'type: "person"'
    ),
  ],

  [
    "Joshua Character Journey",

    finalJoshua.content.includes(
      "characterJourney: ["
    ),
  ],

  [
    "Joshua → Moses",

    /targetSlug\s*:\s*"moses"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Moses → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalMoses.content
      ),
  ],

  [
    "getNode preserved",

    source.includes(
      "export const getNode"
    ),
  ],

];


const failed =
  validations.filter(
    (
      [, result]
    ) =>
      !result
  );


if (
  failed.length >
  0
) {

  throw new Error(
    `검증 실패: ${
      failed
        .map(
          ([name]) =>
            name
        )
        .join(", ")
    }`
  );
}


/* =====================================================
   SAVE
   ===================================================== */

fs.writeFileSync(
  contentPath,
  source,
  "utf8"
);


console.log("");
console.log(
  "========================================"
);

console.log(
  "SCRAPTURA JOSHUA PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "PERSON — JOSHUA"
);

console.log(
  "Character Journey 10 stages"
);

console.log(
  "Joshua → Moses"
);

console.log(
  "Moses → Joshua"
);

console.log(
  "기존 Node가 있는 경우 Exodus / Sinai / Canaan / Jericho 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);