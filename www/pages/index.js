import Head from "next/head";
import Link from "next/link";
import ProductList from "../components/product_list.js";
import Menu from "../components/menu";

function Index({ categories, categoriesTree, setCart, menuOpened, setMenuOpened }) {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Amadeus II d.o.o. shop</title>
      </Head>
      <h2 className="heading text-4xl mt-12 mb-5">Popularne kategorije</h2>
      <ul className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
        {categories
          .filter((c) => c.Slug !== "amadeus-ii-shop")
          .sort((a, b) => a.Products.length < b.Products.length)
          .slice(0, 6)
          .map((c) => {
            return (
              <li key={c.ID}>
                <Link href="/[category]" as={"/" + c.Slug}>
                  <a>
                    <div className="card ~neutral !low h-56">
                      <h3 className="subheading">{c.Name}</h3>
                    </div>
                  </a>
                </Link>
              </li>
            );
          })}
      </ul>
      <h2 className="heading text-4xl mt-12 mb-5">Izdvojeni proizvodi</h2>
      <ProductList
        products={categories.find((c) => c.Slug === "amadeus-ii-shop").Products}
        setCart={setCart}
      />
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
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
