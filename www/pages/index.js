import Head from "next/head";
import Link from "next/link";
import ProductList from "../components/product_list.js";

function Index({ categories }) {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Amadeus II shop</title>
      </Head>

      <h2 className="heading">Popularne kategorije</h2>
      <ul>
        {categories
          .filter((c) => c.Slug !== "amadeus-ii-shop")
          .sort((a, b) => a.Products.length < b.Products.length)
          .slice(0, 6)
          .map((c) => {
            return (
              <li key={c.ID}>
                <Link href={c.Slug}>
                  <a>{c.Name}</a>
                </Link>
              </li>
            );
          })}
      </ul>

      <h2 className="heading">Izdvojeni proizvodi</h2>
      <ProductList
        products={categories.find((c) => c.Slug === "amadeus-ii-shop").Products}
        limit={5}
      />
    </div>
  );
}

export async function getStaticProps(context) {
  const res = await fetch("http://localhost:8080/categories/");
  const categories = await res.json();

  return {
    props: {
      categories,
    },
  };
}

export default Index;
