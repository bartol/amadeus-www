import Head from "next/head";

function SEO({ title, description, image, path }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {title && <title>{title}</title>}
      <link rel="icon" type="image/png" href="/img/icon.png" />
      {description && <meta name="description" content={description} />}
      {image && <meta name="image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://amadeus2.hr/${path}`} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      <meta property="og:url" content={`https://amadeus2.hr/${path}`} />
      <meta property="og:type" content="website" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}

      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    </Head>
  );
}

export default SEO;
