import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

function Index() {
  const { data: categories, error } = useSWR(
    "http://localhost:8080/categories/",
    fetcher
  );

  if (error) return <div>404 TODO</div>;
  if (!categories) return <div>loading...</div>;

  return (
    <div>
      <Head>
        <title>amadeus2.hr</title>
      </Head>

      <h2 className="text-3xl">Popularne kategorije</h2>
      <ul>
        {categories
          .filter((c) => c.Slug !== "amadeus-ii-shop")
          .sort((a, b) => a.Products.length < b.Products.length)
          .slice(0, 6)
          .map((c) => {
            return (
              <li key={c.ID}>
                <Link href={c.Slug}>{c.Name}</Link>
              </li>
            );
          })}
      </ul>

      <h2 className="text-3xl">Izdvojeni proizvodi</h2>
      <ul>
        {categories
          .find((c) => c.Slug === "amadeus-ii-shop")
          .Products.map((p) => {
            return (
              <li key={p.ID}>
                <Link href={p.URL}>{p.Name}</Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Index;
