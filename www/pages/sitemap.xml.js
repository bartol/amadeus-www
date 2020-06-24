function getSitemap(paths) {
  const date = new Date().toISOString().substring(0, 10);

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths
        .map((path) => {
          let priority = "0.80";
          if (path === "") priority = "1";
          if (path.startsWith("info")) priority = "0.20";

          return `
			<url>
			  <loc>https://amadeus2.hr/${path}</loc>
			  <lastmod>${date}</lastmod>
			  <priority>${priority}</priority>
			</url>`;
        })
        .join("")}
    </urlset>`;
}

export async function getServerSideProps({ res }) {
  const paths = [];

  paths.push(""); // index

  paths.push("info/dostava");
  paths.push("info/uvjeti-poslovanja");
  paths.push("info/o-nama");
  paths.push("info/sigurnost-placanja");
  paths.push("info/izjava-o-zastiti-prijenosa-osobnih-podataka");
  paths.push("info/kako-kupovati");
  paths.push("info/povrat-i-zamjena");

  const categoriesRes = await fetch("https://api.amadeus2.hr/categories/");
  const categories = await categoriesRes.json();
  categories.forEach((c) => {
    paths.push(c.Slug);
  });

  const productsRes = await fetch("https://api.amadeus2.hr/products/");
  const products = await productsRes.json();
  products.forEach((p) => {
    paths.push(p.URL);
  });

  res.setHeader("Content-Type", "text/xml");
  res.write(getSitemap(paths));
  res.end();
}

export default () => {};
