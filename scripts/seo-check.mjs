const BASE_URL =
  (
    process.env.SCRAPTURA_BASE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");


const routes = [
  "/stories/david-and-goliath",
  "/people/david",
  "/places/bethlehem",
  "/timeline/united-kingdom",
  "/bible/1-samuel",
  "/visual/noah-ark-visual",
  "/journeys/rise-of-david",
  "/journeys/birth-of-the-kingdom",
];

function extract(
  html,
  pattern
) {
  const match =
    html.match(pattern);

  return match
    ? match[1].trim()
    : "";
}


function getMeta(
  html,
  key,
  attribute = "name"
) {
  const patternA =
    new RegExp(
      `<meta[^>]+${attribute}=["']${key}["'][^>]+content=["']([^"']*)["'][^>]*>`,
      "i"
    );

  const patternB =
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${key}["'][^>]*>`,
      "i"
    );

  return (
    extract(
      html,
      patternA
    ) ||
    extract(
      html,
      patternB
    )
  );
}


function getCanonical(
  html
) {
  return (
    extract(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ) ||
    extract(
      html,
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i
    )
  );
}


async function checkRoute(
  route
) {

  const url =
    `${BASE_URL}${route}`;

  try {

    const response =
      await fetch(
        url,
        {
          redirect:
            "follow",
        }
      );


    const html =
      await response.text();


    const title =
      extract(
        html,
        /<title[^>]*>([\s\S]*?)<\/title>/i
      );


    const description =
      getMeta(
        html,
        "description"
      );


    const ogTitle =
      getMeta(
        html,
        "og:title",
        "property"
      );


    const ogDescription =
      getMeta(
        html,
        "og:description",
        "property"
      );


    const ogImage =
      getMeta(
        html,
        "og:image",
        "property"
      );


    const canonical =
      getCanonical(
        html
      );


    const pass =
      response.status === 200 &&
      Boolean(title) &&
      Boolean(description) &&
      Boolean(ogTitle);


    console.log(
      `\n[${pass ? "PASS" : "FAIL"}] ${route}`
    );

    console.log(
      `status         : ${response.status}`
    );

    console.log(
      `title          : ${title || "(missing)"}`
    );

    console.log(
      `description    : ${description || "(missing)"}`
    );

    console.log(
      `og:title       : ${ogTitle || "(missing)"}`
    );

    console.log(
      `og:description : ${ogDescription || "(missing)"}`
    );

    console.log(
      `og:image       : ${ogImage || "(missing)"}`
    );

    console.log(
      `canonical      : ${canonical || "(missing)"}`
    );


    return pass;

  } catch (error) {

    console.log(
      `\n[FAIL] ${route}`
    );

    console.log(
      error
    );

    return false;
  }
}


console.log(
  `SCRAPTURA SEO QA — ${BASE_URL}`
);

console.log(
  "=".repeat(80)
);


let failed =
  0;


for (
  const route
  of routes
) {

  const result =
    await checkRoute(
      route
    );


  if (!result) {
    failed += 1;
  }
}


console.log(
  "\n" +
  "=".repeat(80)
);


if (
  failed === 0
) {

  console.log(
    "RESULT: PASS"
  );

} else {

  console.log(
    `RESULT: FAIL (${failed})`
  );

  process.exitCode =
    1;
}