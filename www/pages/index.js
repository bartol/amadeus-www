import Head from "next/head";
import Link from "next/link";
import ProductList from "../components/product_list.js";
import Menu from "../components/menu";

function Index({ categories, categoriesTree, setCart }) {
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
                <Link href="/[category]" as={"/" + c.Slug}>
                  <a>{c.Name}</a>
                </Link>
              </li>
            );
          })}
      </ul>

      <h2 className="heading">Izdvojeni proizvodi</h2>
      <ProductList
        products={categories.find((c) => c.Slug === "amadeus-ii-shop").Products}
        limit={30}
        showCategories
        setCart={setCart}
      />

      <Menu categories={categoriesTree} />
    </div>
  );
}

export async function getStaticProps() {
  const categoriesRes = await fetch("https://api.amadeus2.hr/categories/");
  const categories = await categoriesRes.json();

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      categories,
      categoriesTree,
    },
  };
}

export default Index;
