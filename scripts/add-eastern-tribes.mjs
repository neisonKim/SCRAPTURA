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
  "content.before-eastern-tribes.ts"
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
      "land-division",

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
   CREATE STORY — EASTERN TRIBES
   ===================================================== */

let easternTribes =
  findNodeRange(
    source,
    "eastern-tribes"
  );


if (!easternTribes) {

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
        "story",

      targetSlug:
        "land-division",

      relationType:
        "RELATED_STORY",

      label:
        "가나안 땅 분배",
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
     OPTIONAL JORDAN RIVER
     ================================================= */

  if (
    nodeExists(
      source,
      "jordan-river"
    )
  ) {
    relations.push({
      targetType:
        "place",

      targetSlug:
        "jordan-river",

      relationType:
        "RELATED_PLACE",

      label:
        "요단강",
    });
  }


  /* =================================================
     OPTIONAL SHILOH
     ================================================= */

  if (
    nodeExists(
      source,
      "shiloh"
    )
  ) {
    relations.push({
      targetType:
        "place",

      targetSlug:
        "shiloh",

      relationType:
        "RELATED_PLACE",

      label:
        "실로",
    });
  }


  /* =================================================
     OPTIONAL FINAL COVENANT
     ================================================= */

  if (
    nodeExists(
      source,
      "final-covenant-at-shechem"
    )
  ) {
    relations.push({
      targetType:
        "story",

      targetSlug:
        "final-covenant-at-shechem",

      relationType:
        "RELATED_STORY",

      label:
        "세겜에서의 마지막 언약",
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


  const easternTribesNode = `

  /* =====================================================
     STORY — EASTERN TRIBES
     ===================================================== */

  {
    type: "story",

    slug:
      "eastern-tribes",

    titleKo:
      "요단 동쪽 지파들과 제단",

    titleEn:
      "The Eastern Tribes and the Altar",

    eyebrow:
      "STORIES · JOSHUA 22 · EAST OF THE JORDAN",

    summary:
      "르우벤 지파와 갓 지파, 므낫세 반 지파가 요단 동쪽의 기업으로 돌아가던 중 큰 제단을 세우면서 이스라엘 공동체 안에 갈등이 발생하지만, 대표단의 대화를 통해 의도가 밝혀지고 화해에 이르는 이야기입니다.",

    overview:
      "여호수아 22장은 땅 분배 이후 요단 동쪽 지파들이 자신들의 기업으로 돌아가는 과정을 다룹니다. 이들은 요단 부근에 큰 제단을 세우고, 이 소식이 서쪽 지파들에게 전해지면서 심각한 갈등이 발생합니다. 이스라엘 공동체는 실로에 모여 대응을 논의하고 비느하스와 각 지파의 대표자들을 동쪽 지파들에게 보냅니다. 동쪽 지파들은 자신들이 별도의 희생 제단을 만들려 한 것이 아니라 미래 세대에게 서로가 같은 공동체임을 증명하기 위한 표지로 제단을 세웠다고 설명합니다.",

    biblicalContext:
      "SCRAPTURA에서는 여호수아 22장을 단순한 지파 간 분쟁으로만 표현하지 않습니다. 이 사건은 요단강이라는 지리적 경계가 공동체의 정체성 문제로 이어지고, 오해가 실제 충돌 직전까지 확대되었다가 대화와 설명을 통해 해소되는 과정을 보여 줍니다.",


    /* =================================================
       STORY SCENES
       ================================================= */

    scenes: [

      {
        number:
          "01",

        title:
          "THE EASTERN TRIBES",

        scripture:
          "Joshua 22:1–6",

        description:
          "여호수아는 르우벤 지파와 갓 지파, 므낫세 반 지파를 불러 그동안의 역할을 언급하고 요단 동쪽의 기업으로 돌아가도록 보냅니다.",
      },


      {
        number:
          "02",

        title:
          "THE JOURNEY HOME",

        scripture:
          "Joshua 22:7–9",

        description:
          "요단 동쪽 지파들은 가나안 땅에서 자신들에게 주어진 요단 동쪽 지역으로 돌아가기 시작합니다.",
      },


      {
        number:
          "03",

        title:
          "THE GREAT ALTAR",

        scripture:
          "Joshua 22:10",

        description:
          "이들은 요단 부근에 눈에 띄는 큰 제단을 세웁니다.",
      },


      {
        number:
          "04",

        title:
          "ISRAEL GATHERS AT SHILOH",

        scripture:
          "Joshua 22:11–12",

        description:
          "제단에 대한 소식이 서쪽의 이스라엘 공동체에 전해지자 공동체는 실로에 모여 상황에 대응하려 합니다.",
      },


      {
        number:
          "05",

        title:
          "THE DELEGATION",

        scripture:
          "Joshua 22:13–20",

        description:
          "제사장 엘르아살의 아들 비느하스와 각 지파의 대표자들이 요단 동쪽 지파들에게 보내져 제단을 세운 이유를 묻습니다.",
      },


      {
        number:
          "06",

        title:
          "THE ANSWER",

        scripture:
          "Joshua 22:21–24",

        description:
          "요단 동쪽 지파들은 하나님을 떠나거나 다른 제사를 드리기 위해 제단을 세운 것이 아니라고 설명합니다.",
      },


      {
        number:
          "07",

        title:
          "A WITNESS",

        scripture:
          "Joshua 22:25–29",

        description:
          "그들은 요단강 때문에 미래 세대가 서로를 다른 공동체로 여기게 될 가능성을 우려해 제단을 증거의 표지로 세웠다고 말합니다.",
      },


      {
        number:
          "08",

        title:
          "THE CONFLICT ENDS",

        scripture:
          "Joshua 22:30–34",

        description:
          "비느하스와 대표자들이 이 설명을 받아들이고 돌아가면서 충돌의 위기는 해소됩니다.",
      },

    ],


    heroImage:
      "/assets/scraptura-home-clean.jpg",


    scripture: [
      "Joshua 22:1–9",
      "Joshua 22:10–20",
      "Joshua 22:21–34",
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
    easternTribesNode +
    "\n" +
    source.slice(
      nodesEnd
    );


  console.log(
    "STORY — EASTERN TRIBES 실제 Node 추가"
  );

}
else {

  if (
    !easternTribes.content.includes(
      'type: "story"'
    )
  ) {
    throw new Error(
      'slug: "eastern-tribes"가 존재하지만 type이 story가 아닙니다.'
    );
  }


  console.log(
    "STORY — EASTERN TRIBES 이미 존재"
  );
}


/* =====================================================
   VERIFY CREATED NODE
   ===================================================== */

easternTribes =
  findNodeRange(
    source,
    "eastern-tribes"
  );


if (!easternTribes) {
  throw new Error(
    "Eastern Tribes 실제 Node 생성 실패"
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
      "eastern-tribes",

    relationType:
      "RELATED_STORY",

    label:
      "요단 동쪽 지파들과 제단",
  }
);


source = addRelation(
  source,
  "land-division",
  {
    targetType:
      "story",

    targetSlug:
      "eastern-tribes",

    relationType:
      "RELATED_STORY",

    label:
      "요단 동쪽 지파들과 제단",
  }
);


source = addRelation(
  source,
  "book-of-joshua",
  {
    targetType:
      "story",

    targetSlug:
      "eastern-tribes",

    relationType:
      "RELATED_STORY",

    label:
      "요단 동쪽 지파들과 제단",
  }
);


/* =====================================================
   OPTIONAL JORDAN RIVER
   ===================================================== */

if (
  nodeExists(
    source,
    "jordan-river"
  )
) {

  source = addRelation(
    source,
    "eastern-tribes",
    {
      targetType:
        "place",

      targetSlug:
        "jordan-river",

      relationType:
        "RELATED_PLACE",

      label:
        "요단강",
    }
  );


  source = addRelation(
    source,
    "jordan-river",
    {
      targetType:
        "story",

      targetSlug:
        "eastern-tribes",

      relationType:
        "RELATED_STORY",

      label:
        "요단 동쪽 지파들과 제단",
    }
  );
}


/* =====================================================
   OPTIONAL SHILOH
   ===================================================== */

if (
  nodeExists(
    source,
    "shiloh"
  )
) {

  source = addRelation(
    source,
    "eastern-tribes",
    {
      targetType:
        "place",

      targetSlug:
        "shiloh",

      relationType:
        "RELATED_PLACE",

      label:
        "실로",
    }
  );


  source = addRelation(
    source,
    "shiloh",
    {
      targetType:
        "story",

      targetSlug:
        "eastern-tribes",

      relationType:
        "RELATED_STORY",

      label:
        "요단 동쪽 지파들과 제단",
    }
  );
}


/* =====================================================
   OPTIONAL FINAL COVENANT
   ===================================================== */

if (
  nodeExists(
    source,
    "final-covenant-at-shechem"
  )
) {

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
    "final-covenant-at-shechem",
    {
      targetType:
        "story",

      targetSlug:
        "eastern-tribes",

      relationType:
        "RELATED_STORY",

      label:
        "요단 동쪽 지파들과 제단",
    }
  );
}


/* =====================================================
   FINAL VALIDATION
   ===================================================== */

const finalEastern =
  findNodeRange(
    source,
    "eastern-tribes"
  );


const finalLand =
  findNodeRange(
    source,
    "land-division"
  );


const finalJoshua =
  findNodeRange(
    source,
    "joshua"
  );


const finalBook =
  findNodeRange(
    source,
    "book-of-joshua"
  );


if (
  !finalEastern ||
  !finalLand ||
  !finalJoshua ||
  !finalBook
) {
  throw new Error(
    "최종 Eastern Tribes 검증 실패"
  );
}


const validations = [

  [
    "Eastern Tribes slug",

    /^ {4}slug:\s*"eastern-tribes"\s*,?\s*$/m
      .test(
        finalEastern.content
      ),
  ],

  [
    "Eastern Tribes type",

    finalEastern.content.includes(
      'type: "story"'
    ),
  ],

  [
    "Eastern Tribes scenes",

    finalEastern.content.includes(
      "scenes: ["
    ),
  ],

  [
    "Eastern → Joshua",

    /targetSlug\s*:\s*"joshua"/
      .test(
        finalEastern.content
      ),
  ],

  [
    "Eastern → Land Division",

    /targetSlug\s*:\s*"land-division"/
      .test(
        finalEastern.content
      ),
  ],

  [
    "Eastern → Book",

    /targetSlug\s*:\s*"book-of-joshua"/
      .test(
        finalEastern.content
      ),
  ],

  [
    "Joshua → Eastern",

    /targetSlug\s*:\s*"eastern-tribes"/
      .test(
        finalJoshua.content
      ),
  ],

  [
    "Land → Eastern",

    /targetSlug\s*:\s*"eastern-tribes"/
      .test(
        finalLand.content
      ),
  ],

  [
    "Book → Eastern",

    /targetSlug\s*:\s*"eastern-tribes"/
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
  "SCRAPTURA EASTERN TRIBES PATCH COMPLETE"
);

console.log(
  "========================================"
);

console.log(
  "STORY — EASTERN TRIBES"
);

console.log(
  "Story Scenes 8 stages"
);

console.log(
  "Eastern Tribes ↔ Joshua"
);

console.log(
  "Eastern Tribes ↔ Land Division"
);

console.log(
  "Eastern Tribes ↔ Book of Joshua"
);

console.log(
  "Jordan River / Shiloh 존재 시 자동 연결"
);

console.log(
  "Final Covenant 존재 시 자동 연결"
);

console.log(
  "기존 데이터 유지"
);

console.log(
  "백업:",
  backupPath
);