$ErrorActionPreference = "Stop"


Write-Host "==== SCRAPTURA Bible Package Loader Patch ===="


$root = Split-Path -Parent $MyInvocation.MyCommand.Path


$peoplePath  = Join-Path $root "app\people\[slug]\page.tsx"
$storiesPath = Join-Path $root "app\stories\[slug]\page.tsx"
$loaderPath  = Join-Path $root "data\bible\package-loader.ts"


foreach ($path in @($peoplePath, $storiesPath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Required file not found: $path"
  }
}


$loaderDir = Split-Path -Parent $loaderPath
New-Item -ItemType Directory -Force -Path $loaderDir | Out-Null


$loader = @'
import leviticusPackage from "./books/leviticus.json";


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


/* =====================================================
   SCRAPTURA BIBLE PACKAGE REGISTRY
   ===================================================== */


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
'@


Set-Content -LiteralPath $loaderPath -Value $loader -Encoding utf8


function Insert-PackageLoaderImport {
  param([string]$Text)


  if ($Text.Contains('data/bible/package-loader')) {
    return $Text
  }


  $needle = 'from "../../../data/content";'


  if (-not $Text.Contains($needle)) {
    throw "data/content import not found."
  }


  $insert = @'
from "../../../data/content";


import {
  getBiblePackageNode,
} from "../../../data/bible/package-loader";
'@


  return $Text.Replace($needle, $insert)
}


function Replace-FunctionBeforeMarker {
  param(
    [string]$Text,
    [string]$FunctionName,
    [string]$MarkerText,
    [string]$Replacement
  )


  $startToken = "function $FunctionName("
  $start = $Text.IndexOf($startToken)


  if ($start -lt 0) {
    throw "$FunctionName not found."
  }


  $marker = $Text.IndexOf($MarkerText, $start)


  if ($marker -lt 0) {
    throw "Marker not found: $MarkerText"
  }


  $commentStart = $Text.LastIndexOf("/*", $marker)


  if ($commentStart -lt 0 -or $commentStart -le $start) {
    throw "Comment boundary not found before: $MarkerText"
  }


  return $Text.Substring(0, $start) + $Replacement + $Text.Substring($commentStart)
}


$people = Get-Content -Raw -LiteralPath $peoplePath
$stories = Get-Content -Raw -LiteralPath $storiesPath


Copy-Item -LiteralPath $peoplePath -Destination "$peoplePath.before-package-loader.bak" -Force
Copy-Item -LiteralPath $storiesPath -Destination "$storiesPath.before-package-loader.bak" -Force


$people = Insert-PackageLoaderImport -Text $people
$stories = Insert-PackageLoaderImport -Text $stories


$personFunction = @'
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
      local.characterJourney ??
      [],


    scripture:
      local.scripture ??
      [],


    relations:
      local.relations ??
      [],
  };
}




'@


$storyFunction = @'
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
      local.scenes ??
      [],


    scripture:
      local.scripture ??
      [],


    relations:
      local.relations ??
      [],
  };
}




'@


$people = Replace-FunctionBeforeMarker -Text $people -FunctionName "getLocalPerson" -MarkerText "FIRESTORE + LOCAL PERSON" -Replacement $personFunction
$stories = Replace-FunctionBeforeMarker -Text $stories -FunctionName "getLocalStory" -MarkerText "FIRESTORE + LOCAL STORY" -Replacement $storyFunction


$people = $people.Replace("FIRESTORE + LOCAL PERSON", "FIRESTORE + PACKAGE/LOCAL PERSON")
$stories = $stories.Replace("FIRESTORE + LOCAL STORY", "FIRESTORE + PACKAGE/LOCAL STORY")


Set-Content -LiteralPath $peoplePath -Value $people -Encoding utf8
Set-Content -LiteralPath $storiesPath -Value $stories -Encoding utf8


Write-Host ""
Write-Host "PATCH COMPLETE"
Write-Host "Created: data\bible\package-loader.ts"
Write-Host "Updated: app\people\[slug]\page.tsx"
Write-Host "Updated: app\stories\[slug]\page.tsx"
Write-Host ""
Write-Host "Backups:"
Write-Host "  app\people\[slug]\page.tsx.before-package-loader.bak"
Write-Host "  app\stories\[slug]\page.tsx.before-package-loader.bak"
Write-Host ""
Write-Host "Next:"
Write-Host "  npm run build -- --webpack"