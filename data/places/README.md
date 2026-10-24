# Places images and connected journeys

37 previously generic place images were created with built-in ImageGen, then saved as landscape WebP assets in `public/assets/places/` at quality 87. Final prompts are in `image-prompts.mjs`. Original generated PNGs remain in the Codex generated-images directory.

The immutable `image-inventory.json` records 46 local places and 10 published CMS places before changes. Existing published images are reused through `place-images.json`; images for local places that previously borrowed David/battle artwork now resolve to the already published place images. The CMS-only Eden image is also preserved. No original assets or CMS records are overwritten.

The mapper is applied to both Bible package nodes and the merged archive. Place detail pages keep the current local image when the CMS supplies a generic default. Archive cards load images lazily.

Images are artistic reconstructions of biblical landscapes and architecture. Uz and Emmaus do not imply a confirmed modern location; New Jerusalem illustrates the symbolic vision in Revelation.

`data/journeys.ts` connects the current summaries and artwork directly to 16 journeys: 13 chronological routes and 3 thematic routes. All 66 canonical books are linked. Existing David and kingdom journey URLs remain available. Both home/header journey buttons open the updated archive.

Checks: `npm run places:images:check`, `npm run journeys:check`, `npm run places:journeys:verify`. The verifier supports the same Playwright, browser executable, screenshots and base URL flags as `people:images:verify`.
