import Link from "next/link";
import ProductList from "../components/product_list.js";
import Menu from "../components/menu";
import Info from "../components/info.js";
import SEO from "../components/seo.js";

function Index({
  products,
  categories,
  categoriesTree,
  setCart,
  menuOpened,
  setMenuOpened,
  dispatchAlert,
}) {
  return (
    <div className="container mx-auto px-4">
      <SEO title="Amadeus II d.o.o. shop" />
      <Info h1Heading dispatchAlert={dispatchAlert} />
      <h2 className="heading text-4xl mt-12 mb-5">Popularne kategorije</h2>
      <ul className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
        {categories.map((c) => {
          return (
            <li key={c.ID}>
              <Link href="/[category]" as={"/" + c.Slug}>
                <a>
                  <div className="card ~neutral !low h-56">
                    <h3 className="subheading text-2xl">{c.Name}</h3>
                    <h4 className="subheading">{c.Products.length} proizvoda</h4>
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      <h2 className="heading text-4xl mt-12 mb-5">Izdvojeni proizvodi</h2>
      <ProductList products={products} setCart={setCart} dispatchAlert={dispatchAlert} />
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getStaticProps() {
  const categoriesRes = await fetch("https://api.amadeus2.hr/categories/");
  let categories = await categoriesRes.json();

  const products = categories.find((c) => c.Slug === "amadeus-ii-shop").Products;
  categories = categories
    .filter((c) => c.Slug !== "amadeus-ii-shop")
    .sort((a, b) => b.Products.length - a.Products.length)
    .slice(0, 6);

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      products,
      categories,
      categoriesTree,
    },
  };
}

export default Index;
