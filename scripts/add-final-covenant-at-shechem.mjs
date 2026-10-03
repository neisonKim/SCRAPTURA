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
  "content.before-final-covenant-at-shechem.ts"
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

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


function findNodeRange(
  fullSource,
  slug
) {
  const escapedSlug =
    escapeRegex(slug);

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

  if (start === -1) {
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

  if (relationsStart === -1) {
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

  if (relationsEnd === -1) {
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
      "shechem",

    type:
      "place",
  },

  {
    slug:
      "eastern-tribes",

    type:
      "story",
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
   CREATE STORY
   FINAL COVENANT AT SHECHEM
   ===================================================== */

let finalCovenant =
  findNodeRange(
    source,
    "final-covenant-at-shechem"
  );


if (!finalCovenant) {

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
        "shechem",

      relationType:
        "RELATED_PLACE",

      label:
        "세겜",
    },


    {
      targetType:
        "story",

      targetSlug:
        "eastern-tribes",

      relationType:
        "RELATED_STORY",

      label:
        "요단 동쪽 지파들과 제단",
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


  /* =================================================
     OPTIONAL JOSEPH
     ================================================= */

  if (
    nodeExists(
      source,
      "joseph"
    )
  ) {
    relations.push({
      targetType:
        "person",

      targetSlug:
        "joseph",

      relationType:
        "RELATED_PERSON",

      label:
        "요셉",
    });
  }


  /* =================================================
     OPTIONAL MOUNT EBAL
     ================================================= */

  if (
    nodeExists(
      source,
      "mount-ebal"
    )
  ) {
    relations.push({
      targetType:
        "place",

      targetSlug:
        "mount-ebal",

      relationType:
        "RELATED_PLACE",

      label:
        "에발산",
    });
  }


  /* =================================================
     OPTIONAL MOUNT GERIZIM
     ================================================= */

  if (
    nodeExists(
      source,
      "mount-gerizim"
    )
  ) {
    relations.push({
      targetType:
        "place",

      targetSlug:
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
    });
  }


  const relationCode =
    relations
      .map(
        (relation) => `      {
        targetType: "${relation.targetType}",
        targetSlug: "${relation.targetSlug}",
        relationType: "${relation.relationType}",
        label: "${relation.label}",
      },`
      )
      .join(
        "\n\n"
      );


  const finalCovenantNode = `

  /* =====================================================
     STORY — FINAL COVENANT AT SHECHEM
     ===================================================== */

  {
    type: "story",

    slug:
      "final-covenant-at-shechem",

    titleKo:
      "세겜에서의 마지막 언약",

    titleEn:
      "The Final Covenant at Shechem",

    eyebrow:
      "STORIES · JOSHUA 23–24 · SHECHEM",

    summary:
      "여호수아가 생애 말년에 이스라엘 공동체에게 마지막 권면을 전하고, 세겜에서 이스라엘의 역사를 되돌아보며 언약을 새롭게 한 뒤 그의 죽음으로 여호수아서가 마무리되는 이야기입니다.",

    overview:
      "여호수아 23–24장은 여호수아서 전체를 마무리하는 구간입니다. 여호수아는 지도자들에게 하나님을 따르며 율법에서 떠나지 말 것을 권면합니다. 이후 세겜에 이스라엘 지파들을 모으고 아브라함 이전의 시대부터 출애굽, 요단강 도하, 가나안 진입까지 공동체의 역사를 다시 이야기합니다. 백성은 하나님을 섬기겠다고 응답하고 세겜에서 언약이 새롭게 확인됩니다. 이후 여호수아의 죽음과 요셉의 유골 매장, 엘르아살의 죽음이 기록되면서 책이 끝납니다.",

    biblicalContext:
      "SCRAPTURA에서는 여호수아 23장의 마지막 권면과 24장의 세겜 언약을 하나의 Final Covenant Story로 구성합니다. 이 Story는 여호수아서 전체에서 분리된 독립 사건이라기보다 출애굽과 광야, 요단강, 가나안 정복과 땅 분배의 모든 이야기를 다시 회고하고 다음 세대로 넘기는 종결점입니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "JOSHUA'S FINAL WORDS",

        scripture:
          "Joshua 23:1–11",

        description:
          "나이가 든 여호수아는 이스라엘의 장로와 지도자들을 불러 지금까지의 일을 되돌아보고 하나님을 사랑하며 율법을 지킬 것을 권면합니다.",
      },


      {
        number:
          "02",

        title:
          "A FINAL WARNING",

        scripture:
          "Joshua 23:12–16",

        description:
          "여호수아는 다른 민족들의 신을 따르거나 언약에서 떠나지 말 것을 공동체에 경고합니다.",
      },


      {
        number:
          "03",

        title:
          "THE ASSEMBLY AT SHECHEM",

        scripture:
          "Joshua 24:1",

        description:
          "여호수아는 이스라엘의 모든 지파와 지도자들을 세겜으로 불러 공동체를 다시 한자리에 모읍니다.",
      },


      {
        number:
          "04",

        title:
          "REMEMBER THE JOURNEY",

        scripture:
          "Joshua 24:2–13",

        description:
          "아브라함의 조상들부터 이집트와 출애굽, 광야, 요단강을 거쳐 가나안에 이르기까지 이스라엘의 역사가 다시 이야기됩니다.",
      },


      {
        number:
          "05",

        title:
          "CHOOSE WHOM YOU WILL SERVE",

        scripture:
          "Joshua 24:14–15",

        description:
          "여호수아는 공동체에게 누구를 섬길 것인지 선택하라고 요구하며 자신과 자신의 집은 하나님을 섬기겠다고 선언합니다.",
      },


      {
        number:
          "06",

        title:
          "ISRAEL RESPONDS",

        scripture:
          "Joshua 24:16–24",

        description:
          "이스라엘 백성은 자신들도 하나님을 섬기겠다고 응답하고 여호수아와 백성 사이의 대화가 이어집니다.",
      },


      {
        number:
          "07",

        title:
          "THE COVENANT AT SHECHEM",

        scripture:
          "Joshua 24:25–27",

        description:
          "여호수아는 세겜에서 백성과 언약을 맺고 율례와 법도를 세우며 큰 돌을 증거로 세웁니다.",
      },


      {
        number:
          "08",

        title:
          "RETURN TO THE INHERITANCE",

        scripture:
          "Joshua 24:28",

        description:
          "언약 장면이 끝난 뒤 여호수아는 백성을 각자의 기업으로 돌려보냅니다.",
      },


      {
        number:
          "09",

        title:
          "THE DEATH OF JOSHUA",

        scripture:
          "Joshua 24:29–31",

        description:
          "여호수아는 백십 세에 죽고 자신의 기업에 장사됩니다. 본문은 여호수아와 그 시대의 장로들이 살아 있는 동안 이스라엘이 하나님을 섬겼다고 기록합니다.",
      },


      {
        number:
          "10",

        title:
          "JOSEPH'S BONES",

        scripture:
          "Joshua 24:32",

        description:
          "이스라엘이 이집트에서 가져온 요셉의 유골은 세겜에 묻히며 창세기와 출애굽기에서 시작된 오랜 이야기가 다시 연결됩니다.",
      },


      {
        number:
          "11",

        title:
          "THE END OF AN ERA",

        scripture:
          "Joshua 24:33",

        description:
          "대제사장 엘르아살의 죽음이 기록되며 여호수아서와 한 시대의 이야기가 마무리됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 23",
      "Joshua 24:1–28",
      "Joshua 24:29–33",
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
    finalCovenantNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — FINAL COVENANT AT SHECHEM 실제 Node 추가"
  );

}
else {

  if (
    !finalCovenant.content.includes(
      'type: "story"'
    )
  ) {
    throw new Error(
      'slug: "final-covenant-at-shechem"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — FINAL COVENANT AT SHECHEM 이미 존재"
  );
}


/* =====================================================
   VERIFY CREATED NODE
   ===================================================== */

finalCovenant =
  findNodeRange(
    source,
    "final-covenant-at-shechem"
  );


if (!finalCovenant) {
  throw new Error(
    "Final Covenant 실제 Node 생성 실패"
  );
}


/* =====================================================
   REQUIRED BACKLINKS
   ===================================================== */

source = addRelation(
  source,
  "joshua",
  {
    targetType:
      "story",

    targetSlug:
      "final-covenant-at-shechem",

    relationType:
      "RELATED_STORY",

    label:
      "세겜에서의 마지막 언약",
  }
);


source = addRelation(
  source,
  "shechem",
  {
    targetType:
      "story",

    targetSlug:
      "final-covenant-at-shechem",

    relationType:
      "RELATED_STORY",

    label:
      "세겜에서의 마지막 언약",
  }
);


source = addRelation(
  source,
  "eastern-tribes",
  {
    targetType:
      "story",

    targetSlug:
      "final-covenant-at-shechem",

    relationType:
      "RELATED_STORY",

    label:
      "세겜에서의 마지막 언약",
  }
);


source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType:
      "story",

    targetSlug:
      "final-covenant-at-shechem",

    relationType:
      "RELATED_STORY",

    label:
      "세겜에서의 마지막 언약",
  }
);


/* =====================================================
   OPTIONAL JOSEPH
   ===================================================== */

if (
  nodeExists(
    source,
    "joseph"
  )
) {

  source = addRelation(
    source,
    "final-covenant-at-shechem",
    {
      targetType:
        "person",

      targetSlug:
        "joseph",

      relationType:
        "RELATED_PERSON",

      label:
        "요셉",
    }
  );


  source = addRelation(
    source,
    "joseph",
    {
      targetType:
        "story",

      targetSlug:
        "final-covenant-at-shechem",

      relationType:
        "RELATED_STORY",

      label:
        "세겜에서의 마지막 언약",
    }
  );
}


/* =====================================================
   OPTIONAL EBAL
   ===================================================== */

if (
  nodeExists(
    source,
    "mount-ebal"
  )
) {

  source = addRelation(
    source,
    "final-covenant-at-shechem",
    {
      targetType:
        "place",

      targetSlug:
        "mount-ebal",

      relationType:
        "RELATED_PLACE",

      label:
        "에발산",
    }
  );
}


/* =====================================================
   OPTIONAL GERIZIM
   ===================================================== */

if (
  nodeExists(
    source,
    "mount-gerizim"
  )
) {

  source = addRelation(
    source,
    "final-covenant-at-shechem",
    {
      targetType:
        "place",

      targetSlug:
        "mount-gerizim",

      relationType:
        "RELATED_PLACE",

      label:
        "그리심산",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalStory =
  findNodeRange(
    source,
    "final-covenant-at-shechem"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalShechem =
  findNodeRange(
    source,
    "shechem"
  );


const finalEastern =
  findNodeRange(
    source,
    "eastern-tribes"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalStory ||
  !finalJoshua ||
  !finalShechem ||
  !finalEastern ||
  !finalBook
) {
  throw new Error(
    "최종 Final Covenant 검증 실패"
  );
}


const validations = [

  [
    "Final Covenant slug",

    /^ {4}slug:\s*"final-covenant-at-shechem"\s*,?\s*$/m
      .test(
        finalStory.content
      ),
  ],

  [
    "Final Covenant type",

    finalStory.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Final Covenant scenes",

    finalStory.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Story → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Shechem",

    /targetSlug\s*:\s*"shechem"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Eastern Tribes",

    /targetSlug\s*:\s*"eastern-tribes"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Story → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalStory.content
      ),
  ],

  [
    "Joshua → Story",

    /targetSlug\s*:\s*"final-covenant-at-shechem"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Shechem → Story",

    /targetSlug\s*:\s*"final-covenant-at-shechem"/
      .test(
        finalShechem.content
      ),
  ],

  [
    "Eastern Tribes → Story",

    /targetSlug\s*:\s*"final-covenant-at-shechem"/
      .test(
        finalEastern.content
      ),
  ],

  [
    "Book → Story",

    /targetSlug\s*:\s*"final-covenant-at-shechem"/
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
    ([, result]) =>
      !result
  );


if (
  failed.length > 0
) {
  throw new Error(
    `검증 실패: ${
      failed
        .map(
          ([name]) => name
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
  "SCRAPTURA FINAL COVENANT PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — FINAL COVENANT AT SHECHEM"
);

console.log(
  "Story Scenes 11 stages"
);

console.log(
  "Final Covenant ↔ Joshua"
);

console.log(
  "Final Covenant ↔ Shechem"
);

console.log(
  "Final Covenant ↔ Eastern Tribes"
);

console.log(
  "Final Covenant ↔ Book of Joshua"
);

console.log(
  "Joseph 존재 시 자동 연결"
);

console.log(
  "Mount Ebal / Mount Gerizim 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);

console.log("");
console.log(
  "JOSHUA CONTENT BUILD COMPLETE"
);