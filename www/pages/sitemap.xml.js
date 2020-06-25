function getSitemap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((p) => {
          return `
			<url>
			  <loc>https://amadeus2.hr/${p.path}</loc>
			  <lastmod>${p.date}</lastmod>
			  <priority>${p.priority}</priority>
			</url>`;
        })
        .join("")}
    </urlset>`;
}

export async function getServerSideProps({ res }) {
  const today = new Date().toISOString();
  const pages = [];

  // index pages
  pages.push({ path: "", date: today, priority: "1" });

  const categoriesRes = await fetch("https://api.amadeus2.hr/categories/");
  const categories = await categoriesRes.json();
  categories.forEach((c) => {
    pages.push({ path: c.Slug, date: c.LastUpdated, priority: "0.80" });
  });

  const productsRes = await fetch("https://api.amadeus2.hr/products/");
  const products = await productsRes.json();
  products.forEach((p) => {
    pages.push({ path: p.URL, date: p.LastUpdated, priority: "0.80" });
  });

  const infoPages = [
    "info/dostava",
    "info/uvjeti-poslovanja",
    "info/o-nama",
    "info/sigurnost-placanja",
    "info/izjava-o-zastiti-prijenosa-osobnih-podataka",
    "info/kako-kupovati",
    "info/povrat-i-zamjena",
  ];
  infoPages.forEach((path) => {
    pages.push({ path, date: today, priority: "0.20" });
  });

  res.setHeader("Content-Type", "text/xml");
  res.write(getSitemap(pages));
  res.end();
}

export default () => {};
