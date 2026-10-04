const fs = require("fs");
const path = require("path");

const root = process.cwd();

const peoplePath = path.join(
  root,
  "app",
  "people",
  "[slug]",
  "page.tsx"
);

const storiesPath = path.join(
  root,
  "app",
  "stories",
  "[slug]",
  "page.tsx"
);

const peopleBackup =
  peoplePath + ".before-package-loader.bak";

const storiesBackup =
  storiesPath + ".before-package-loader.bak";

const loaderPath = path.join(
  root,
  "data",
  "bible",
  "package-loader.ts"
);

if (!fs.existsSync(peopleBackup)) {
  throw new Error(
    "People backup not found: " + peopleBackup
  );
}

if (!fs.existsSync(storiesBackup)) {
  throw new Error(
    "Stories backup not found: " + storiesBackup
  );
}

/*
 * 1. ??? ? ?? ??? ???? ??? ??
 */
fs.copyFileSync(
  peopleBackup,
  peoplePath
);

fs.copyFileSync(
  storiesBackup,
  storiesPath
);

console.log("UTF-8 originals restored.");


/*
 * 2. ?? Bible Package Loader ??
 */
const loader = `import leviticusPackage from "./books/leviticus.json";

export type BiblePackageNodeType =
  | "book"
  | "story"
  | "person"
  | "place"
  | "period"
  | "visual";

export type BiblePackageNode =
  Record<string, unknown> & {
    type?: unknown;
    slug?: unknown;
  };

type BiblePackage = {
  nodes?: BiblePackageNode[];
};

const biblePackages: BiblePackage[] = [
  leviticusPackage as BiblePackage,
];

export function getBiblePackageNode(
  type: BiblePackageNodeType,
  slugValue: string
): BiblePackageNode | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();

  if (!slug) {
    return null;
  }

  for (const biblePackage of biblePackages) {

    const node =
      biblePackage.nodes?.find(
        (item) =>
          item.type === type &&
          typeof item.slug === "string" &&
          item.slug
            .trim()
            .toLowerCase() === slug
      );

    if (node) {
      return node;
    }
  }

  return null;
}
`;

fs.writeFileSync(
  loaderPath,
  loader,
  "utf8"
);


/*
 * ?? import ??
 */
function addLoaderImport(source) {

  if (
    source.includes(
      "../../../data/bible/package-loader"
    )
  ) {
    return source;
  }

  const target =
    'from "../../../data/content";';

  if (!source.includes(target)) {
    throw new Error(
      "data/content import not found."
    );
  }

  return source.replace(
    target,
    target +
      `

import {
  getBiblePackageNode,
} from "../../../data/bible/package-loader";`
  );
}


/*
 * ?? ?? ??
 */
function replaceFunction(
  source,
  functionName,
  markerText,
  replacement
) {

  const start =
    source.indexOf(
      "function " + functionName + "("
    );

  if (start === -1) {
    throw new Error(
      functionName + " not found."
    );
  }

  const marker =
    source.indexOf(
      markerText,
      start
    );

  if (marker === -1) {
    throw new Error(
      markerText + " marker not found."
    );
  }

  const commentStart =
    source.lastIndexOf(
      "/*",
      marker
    );

  if (commentStart === -1) {
    throw new Error(
      "Comment boundary not found."
    );
  }

  return (
    source.slice(0, start) +
    replacement +
    "\n\n" +
    source.slice(commentStart)
  );
}


/*
 * PEOPLE
 */
let people =
  fs.readFileSync(
    peoplePath,
    "utf8"
  );

people =
  addLoaderImport(
    people
  );

const personFunction = `
function getLocalPerson(
  slugValue: string
): PersonRecord | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();

  if (!slug) {
    return null;
  }

  const packageNode =
    getBiblePackageNode(
      "person",
      slug
    );

  if (packageNode) {

    return {
      id:
        "package__" + slug,

      type:
        "person",

      slug:
        normalizeString(
          packageNode.slug
        ) || slug,

      titleKo:
        normalizeString(
          packageNode.titleKo
        ),

      titleEn:
        normalizeString(
          packageNode.titleEn
        ),

      eyebrow:
        normalizeString(
          packageNode.eyebrow
        ),

      summary:
        normalizeString(
          packageNode.summary
        ),

      overview:
        normalizeString(
          packageNode.overview
        ) || undefined,

      heroImage:
        normalizeString(
          packageNode.heroImage
        ) ||
        "/assets/scraptura-home-clean.jpg",

      characterJourney:
        normalizeCharacterJourney(
          packageNode.characterJourney
        ),

      scripture:
        normalizeScripture(
          packageNode.scripture
        ),

      relations:
        normalizeRelations(
          packageNode.relations
        ),
    };
  }

  const local =
    getNode(
      "person",
      slug
    );

  if (!local) {
    return null;
  }

  return {
    id:
      "local__" + local.slug,

    type:
      "person",

    slug:
      local.slug,

    titleKo:
      local.titleKo,

    titleEn:
      local.titleEn,

    eyebrow:
      local.eyebrow,

    summary:
      local.summary,

    overview:
      local.overview,

    heroImage:
      local.heroImage,

    characterJourney:
      local.characterJourney ?? [],

    scripture:
      local.scripture ?? [],

    relations:
      local.relations ?? [],
  };
}
`;

people =
  replaceFunction(
    people,
    "getLocalPerson",
    "FIRESTORE + LOCAL PERSON",
    personFunction
  );

people =
  people.replace(
    "FIRESTORE + LOCAL PERSON",
    "FIRESTORE + PACKAGE/LOCAL PERSON"
  );

fs.writeFileSync(
  peoplePath,
  people,
  "utf8"
);


/*
 * STORIES
 */
let stories =
  fs.readFileSync(
    storiesPath,
    "utf8"
  );

stories =
  addLoaderImport(
    stories
  );

const storyFunction = `
function getLocalStory(
  slugValue: string
): StoryRecord | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();

  if (!slug) {
    return null;
  }

  const packageNode =
    getBiblePackageNode(
      "story",
      slug
    );

  if (packageNode) {

    return {
      id:
        "package__" + slug,

      type:
        "story",

      slug:
        normalizeString(
          packageNode.slug
        ) || slug,

      titleKo:
        normalizeString(
          packageNode.titleKo
        ),

      titleEn:
        normalizeString(
          packageNode.titleEn
        ),

      eyebrow:
        normalizeString(
          packageNode.eyebrow
        ),

      summary:
        normalizeString(
          packageNode.summary
        ),

      overview:
        normalizeString(
          packageNode.overview
        ) || undefined,

      heroImage:
        normalizeString(
          packageNode.heroImage
        ) ||
        "/assets/scraptura-home-clean.jpg",

      scenes:
        normalizeScenes(
          packageNode.scenes
        ),

      scripture:
        normalizeScripture(
          packageNode.scripture
        ),

      relations:
        normalizeRelations(
          packageNode.relations
        ),
    };
  }

  const local =
    getNode(
      "story",
      slug
    );

  if (!local) {
    return null;
  }

  return {
    id:
      "local__" + local.slug,

    type:
      "story",

    slug:
      local.slug,

    titleKo:
      local.titleKo,

    titleEn:
      local.titleEn,

    eyebrow:
      local.eyebrow,

    summary:
      local.summary,

    overview:
      local.overview,

    heroImage:
      local.heroImage,

    scenes:
      local.scenes ?? [],

    scripture:
      local.scripture ?? [],

    relations:
      local.relations ?? [],
  };
}
`;

stories =
  replaceFunction(
    stories,
    "getLocalStory",
    "FIRESTORE + LOCAL STORY",
    storyFunction
  );

stories =
  stories.replace(
    "FIRESTORE + LOCAL STORY",
    "FIRESTORE + PACKAGE/LOCAL STORY"
  );

fs.writeFileSync(
  storiesPath,
  stories,
  "utf8"
);

console.log("");
console.log("================================");
console.log("SCRAPTURA UTF-8 REPAIR COMPLETE");
console.log("================================");
console.log("People restored + JSON loader");
console.log("Stories restored + JSON loader");
console.log("package-loader.ts created");
