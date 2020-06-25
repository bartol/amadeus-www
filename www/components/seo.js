import Head from "next/head";
import { getReductedPrice } from "../helpers/price";

function SEO({
  title,
  description,
  image = "https://amadeus2.hr/img/logo.png",
  path = "",
  breadcrumbs,
  product,
}) {
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

      {breadcrumbs && (
        <script type="application/ld+json">{`
			{
			  "@context": "https://schema.org",
			  "@type": "BreadcrumbList",
			  "itemListElement": [${breadcrumbs
          .map((b, i) => {
            const url = b.Slug !== undefined ? `,"item": "https://amadeus2.hr/${b.Slug}"` : "";
            return `{
					"@type": "ListItem",
					"position": ${i + 1},
					"name": "${b.Name}"${url}
				  }`;
          })
          .join(",")}]
			}
			`}</script>
      )}

      {product && (
        <script type="application/ld+json">
          {`
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "${product.Name}",
      "image": [${product.Images.map((i) => `"${i.URL}"`).join(",")}],
      "description": "${
        product.Name +
        " | " +
        product.Categories[product.Categories.length - 1].Name +
        product.Features.map((f) => " | " + f.Name + ": " + f.Value)
      }",
      "offers": {
        "@type": "Offer",
        "url": "https://amadeus2.hr/${product.URL}",
        "priceCurrency": "kn",
        "price": "${
          product.HasReduction
            ? getReductedPrice(product.Price, product.Reduction, product.ReductionType, true)
            : product.Price
        }",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Amadeus II d.o.o."
        }
      }
    }`}
        </script>
      )}
    </Head>
  );
}

export default SEO;
