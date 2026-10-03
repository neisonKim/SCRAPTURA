/* =====================================================
   SCRAPTURA CONTENT TYPES
   ===================================================== */

export type ContentType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";


export type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_PERIOD"
  | "RELATED_BOOK"
  | "RELATED_STORY";


/* =====================================================
   RELATION
   ===================================================== */

export type Relation = {
  targetType: ContentType;

  targetSlug: string;

  relationType: RelationType;

  label: string;
};


/* =====================================================
   STORY SCENE
   ===================================================== */

export type StoryScene = {
  number: string;

  title: string;

  scripture: string;

  description: string;

  image?: string;
};


/* =====================================================
   CHARACTER / BOOK / PERIOD STAGE
   ===================================================== */

export type CharacterStage = {
  number: string;

  title: string;

  scripture: string;

  description: string;
};


/* =====================================================
   CONTENT NODE
   ===================================================== */

export type ContentNode = {
  type: ContentType;

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  heroImage: string;

  overview?: string;

  biblicalContext?: string;

  keyEvent?: {
    title: string;

    scripture: string;

    description: string;
  };

  periodStages?:
    CharacterStage[];

  bookSections?:
    CharacterStage[];

  scenes?:
    StoryScene[];

  characterJourney?:
    CharacterStage[];

  scripture?:
    string[];

  relations?:
    Relation[];
};