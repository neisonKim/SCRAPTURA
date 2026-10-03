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
  "content.before-gibeonite-treaty.ts"
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
   HELPERS
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
      `^ {4}slug:\\s*"${escapedSlug}"\\s*,?\\s*$`,
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


  if (
    start === -1
  ) {

    throw new Error(
      `${slug} 노드 시작 위치를 찾지 못했습니다.`
    );
  }


  const afterSlug =
    fullSource.slice(
      slugIndex
    );


  const endMatch =
    /\r?\n {2}\},/.exec(
      afterSlug
    );


  if (!endMatch) {

    throw new Error(
      `${slug} 노드 종료 위치를 찾지 못했습니다.`
    );
  }


  const end =
    slugIndex +
    endMatch.index +
    endMatch[0].length;


  return {
    start,
    end,

    content:
      fullSource.slice(
        start,
        end
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
   RELATIONS END
   ===================================================== */

function findRelationsEnd(
  nodeContent,
  relationsStart
) {

  const rest =
    nodeContent.slice(
      relationsStart
    );


  const match =
    /\r?\n {4}\],/.exec(
      rest
    );


  if (!match) {
    return -1;
  }


  return (
    relationsStart +
    match.index
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
      `${nodeSlug} relations 없음 → 관계 추가 생략`
    );

    return fullSource;
  }


  const relationsEnd =
    findRelationsEnd(
      node.content,
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
   REQUIRED NODES
   ===================================================== */

const requiredNodes = [

  {
    slug:
      "joshua",

    type:
      "person",
  },

  {
    slug:
      "gibeon",

    type:
      "place",
  },

  {
    slug:
      "gilgal",

    type:
      "place",
  },

  {
    slug:
      "book-of-joshua",

    type:
      "book",
  },

];


for (
  const required
  of requiredNodes
) {

  const node =
    findNodeRange(
      source,
      required.slug
    );


  if (!node) {

    throw new Error(
      `필수 Node를 찾지 못했습니다: ${required.slug}`
    );
  }


  if (
    !node.content.includes(
      `type: "${required.type}"`
    )
  ) {

    throw new Error(
      `${required.slug}의 type이 ${required.type}이 아닙니다.`
    );
  }


  console.log(
    `${required.slug} 확인`
  );
}


/* =====================================================
   CREATE STORY — GIBEONITE TREATY
   ===================================================== */

let treaty =
  findNodeRange(
    source,
    "gibeonite-treaty"
  );


if (!treaty) {

  const relations = [

    {
      targetType:
        "person",

      targetSlug:
        "joshua",

      relationType:
        "RELATED_PERSON",

      label:
        "여호수아",
    },


    {
      targetType:
        "place",

      targetSlug:
        "gibeon",

      relationType:
        "RELATED_PLACE",

      label:
        "기브온",
    },


    {
      targetType:
        "place",

      targetSlug:
        "gilgal",

      relationType:
        "RELATED_PLACE",

      label:
        "길갈",
    },


    {
      targetType:
        "book",

      targetSlug:
        "book-of-joshua",

      relationType:
        "RELATED_BOOK",

      label:
        "여호수아",
    },

  ];


  /*
   * PREVIOUS STORY
   */

  if (
    nodeExists(
      source,
      "covenant-at-ebal-and-gerizim"
    )
  ) {

    relations.push({
      targetType:
        "story",

      targetSlug:
        "covenant-at-ebal-and-gerizim",

      relationType:
        "RELATED_STORY",

      label:
        "에발산과 그리심산의 언약",
    });
  }


  /*
   * NEXT STORY
   */

  if (
    nodeExists(
      source,
      "southern-campaign"
    )
  ) {

    relations.push({
      targetType:
        "story",

      targetSlug:
        "southern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 남부 전투",
    });
  }


  const relationCode =
    relations
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


  const treatyNode = `

  /* =====================================================
     STORY — GIBEONITE TREATY
     ===================================================== */

  {
    type: "story",

    slug:
      "gibeonite-treaty",

    titleKo:
      "기브온 주민들과의 조약",

    titleEn:
      "The Gibeonite Treaty",

    eyebrow:
      "STORIES · JOSHUA 9 · CANAAN",

    summary:
      "기브온 주민들이 먼 지역에서 온 사람들처럼 꾸미고 길갈의 이스라엘 진영을 찾아와 조약을 요청하며, 이후 그들의 실제 정체가 밝혀지는 이야기입니다.",

    overview:
      "여호수아 9장에서 기브온 주민들은 이스라엘과 직접 싸우는 대신 다른 방법을 선택합니다. 낡은 자루와 낡은 가죽 부대, 해어진 옷과 마른 빵을 준비해 자신들이 먼 나라에서 왔다고 설명합니다. 이스라엘 지도자들은 그들과 조약을 맺지만 며칠 뒤 그들이 가까운 지역에 살던 사람들이었음을 알게 됩니다. 이미 맹세한 조약 때문에 공동체는 그들을 죽이지 않고 다른 역할을 맡깁니다.",

    biblicalContext:
      "기브온 사건은 여호수아서에서 군사적 정복과 다른 형태의 갈등을 보여 줍니다. SCRAPTURA에서는 Gibeon과 Gilgal을 중심으로 조약 체결과 그 결과를 하나의 Story Node로 구성하고, 바로 다음 장의 Southern Campaign으로 연결합니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "NEWS FROM CANAAN",

        scripture:
          "Joshua 9:1–2",

        description:
          "가나안 지역의 여러 왕들이 이스라엘의 진입 소식을 듣고 대응하려는 움직임을 보입니다.",
      },


      {
        number:
          "02",

        title:
          "THE GIBEONITE PLAN",

        scripture:
          "Joshua 9:3–5",

        description:
          "기브온 주민들은 다른 방식으로 대응하기로 하고 낡은 물건과 옷을 준비해 먼 지역에서 온 사람들처럼 꾸밉니다.",
      },


      {
        number:
          "03",

        title:
          "ARRIVAL AT GILGAL",

        scripture:
          "Joshua 9:6",

        description:
          "기브온 주민들은 길갈의 이스라엘 진영으로 찾아와 자신들이 먼 나라에서 왔다고 말하며 조약을 요청합니다.",
      },


      {
        number:
          "04",

        title:
          "THE OLD BREAD",

        scripture:
          "Joshua 9:7–13",

        description:
          "그들은 낡은 자루와 부대, 옷과 신발, 마른 빵을 증거로 제시하며 자신들의 이야기를 설명합니다.",
      },


      {
        number:
          "05",

        title:
          "THE TREATY",

        scripture:
          "Joshua 9:14–15",

        description:
          "이스라엘 지도자들은 그들의 양식을 확인한 뒤 기브온 주민들과 평화 조약을 맺고 그들을 살려 주기로 맹세합니다.",
      },


      {
        number:
          "06",

        title:
          "THREE DAYS LATER",

        scripture:
          "Joshua 9:16–17",

        description:
          "조약을 맺은 지 사흘 뒤 이스라엘은 그들이 실제로 가까운 지역에 살던 사람들이었음을 알게 됩니다.",
      },


      {
        number:
          "07",

        title:
          "THE OATH REMAINS",

        scripture:
          "Joshua 9:18–21",

        description:
          "공동체 안에서 불만이 제기되지만 지도자들은 이미 맹세한 조약을 이유로 기브온 주민들을 죽이지 않기로 합니다.",
      },


      {
        number:
          "08",

        title:
          "THE GIBEONITES",

        scripture:
          "Joshua 9:22–27",

        description:
          "여호수아는 기브온 주민들에게 이유를 묻고, 그들은 자신들의 선택을 설명합니다. 이후 그들은 공동체 안에서 맡은 역할을 수행하게 됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 9:1–27",
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
    treatyNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — GIBEONITE TREATY 실제 Node 추가"
  );

}
else {

  if (
    !treaty.content.includes(
      'type: "story"'
    )
  ) {

    throw new Error(
      'slug: "gibeonite-treaty"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — GIBEONITE TREATY 이미 존재"
  );
}


/* =====================================================
   VERIFY STORY
   ===================================================== */

treaty =
  findNodeRange(
    source,
    "gibeonite-treaty"
  );


if (!treaty) {

  throw new Error(
    "Gibeonite Treaty 실제 Node 생성 실패"
  );
}


/* =====================================================
   JOSHUA → TREATY
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {

    targetType:
      "story",

    targetSlug:
      "gibeonite-treaty",

    relationType:
      "RELATED_STORY",

    label:
      "기브온 주민들과의 조약",
  }
);


/* =====================================================
   GIBEON → TREATY
   ===================================================== */

source = addRelation(
  source,
  "gibeon",
  {

    targetType:
      "story",

    targetSlug:
      "gibeonite-treaty",

    relationType:
      "RELATED_STORY",

    label:
      "기브온 주민들과의 조약",
  }
);


/* =====================================================
   GILGAL → TREATY
   ===================================================== */

source = addRelation(
  source,
  "gilgal",
  {

    targetType:
      "story",

    targetSlug:
      "gibeonite-treaty",

    relationType:
      "RELATED_STORY",

    label:
      "기브온 주민들과의 조약",
  }
);


/* =====================================================
   BOOK → TREATY
   ===================================================== */

source = addRelation(
  source,
  "book-of-joshua",
  {

    targetType:
      "story",

    targetSlug:
      "gibeonite-treaty",

    relationType:
      "RELATED_STORY",

    label:
      "기브온 주민들과의 조약",
  }
);


/* =====================================================
   PREVIOUS STORY ↔ TREATY
   ===================================================== */

if (
  nodeExists(
    source,
    "covenant-at-ebal-and-gerizim"
  )
) {

  source = addRelation(
    source,
    "covenant-at-ebal-and-gerizim",
    {

      targetType:
        "story",

      targetSlug:
        "gibeonite-treaty",

      relationType:
        "RELATED_STORY",

      label:
        "기브온 주민들과의 조약",
    }
  );
}


/* =====================================================
   SOUTHERN CAMPAIGN ↔ TREATY
   ===================================================== */

if (
  nodeExists(
    source,
    "southern-campaign"
  )
) {

  source = addRelation(
    source,
    "gibeonite-treaty",
    {

      targetType:
        "story",

      targetSlug:
        "southern-campaign",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 남부 전투",
    }
  );


  source = addRelation(
    source,
    "southern-campaign",
    {

      targetType:
        "story",

      targetSlug:
        "gibeonite-treaty",

      relationType:
        "RELATED_STORY",

      label:
        "기브온 주민들과의 조약",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalTreaty =
  findNodeRange(
    source,
    "gibeonite-treaty"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalGibeon =
  findNodeRange(
    source,
    "gibeon"
  );


const finalGilgal =
  findNodeRange(
    source,
    "gilgal"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalTreaty ||
  !finalJoshua ||
  !finalGibeon ||
  !finalGilgal ||
  !finalBook
) {

  throw new Error(
    "최종 Gibeonite Treaty 검증 실패"
  );
}


const validations = [

  [
    "Treaty actual slug",

    /^ {4}slug:\s*"gibeonite-treaty"\s*,?\s*$/m
      .test(
        finalTreaty.content
      ),
  ],

  [
    "Treaty Type",

    finalTreaty.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Treaty Scenes",

    finalTreaty.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Treaty → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalTreaty.content
      ),
  ],

  [
    "Treaty → Gibeon",

    /targetSlug\s*:\s*"gibeon"/
      .test(
        finalTreaty.content
      ),
  ],

  [
    "Treaty → Gilgal",

    /targetSlug\s*:\s*"gilgal"/
      .test(
        finalTreaty.content
      ),
  ],

  [
    "Treaty → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalTreaty.content
      ),
  ],

  [
    "Joshua → Treaty",

    /targetSlug\s*:\s*"gibeonite-treaty"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Gibeon → Treaty",

    /targetSlug\s*:\s*"gibeonite-treaty"/
      .test(
        finalGibeon.content
      ),
  ],

  [
    "Gilgal → Treaty",

    /targetSlug\s*:\s*"gibeonite-treaty"/
      .test(
        finalGilgal.content
      ),
  ],

  [
    "Book → Treaty",

    /targetSlug\s*:\s*"gibeonite-treaty"/
      .test(
        finalBook.content
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
  "SCRAPTURA GIBEONITE TREATY PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — GIBEONITE TREATY"
);

console.log(
  "Story Scenes 8 stages"
);

console.log(
  "Gibeonite Treaty ↔ Joshua"
);

console.log(
  "Gibeonite Treaty ↔ Gibeon"
);

console.log(
  "Gibeonite Treaty ↔ Gilgal"
);

console.log(
  "Gibeonite Treaty ↔ Book of Joshua"
);

console.log(
  "Southern Campaign 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);