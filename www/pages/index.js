import Link from "next/link";
import ProductList from "../components/product_list.js";
import Menu from "../components/menu";
import Info from "../components/info.js";
import SEO from "../components/seo.js";
import { ExternalLink } from "react-feather";

function Index({
  products,
  categories,
  categoriesTree,
  setCart,
  setCartOpened,
  menuOpened,
  setMenuOpened,
  dispatchAlert,
}) {
  return (
    <div className="container mx-auto px-4">
      <SEO
        title="Amadeus II d.o.o. shop"
        description="Amadeus II d.o.o. je trgovina specijalizirana za prodaju putem interneta i nudi više od 10000 raspoloživih artikala iz različitih područja informatike, potrošačke elektronike..."
      />
      <Info h1Heading dispatchAlert={dispatchAlert} />
      <div className="mt-16">
        <Link href="/info/darovi-jeseni">
          <a>
            <img src="/img/darovi-jeseni.jpg" />
          </a>
        </Link>
      </div>
      <h2 className="heading text-4xl mt-12 mb-5">Popularne kategorije</h2>
      <ul className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
        {categories.map((c) => {
          return (
            <li key={c.ID}>
              <Link href="/[category]" as={"/" + c.Slug}>
                <a>
                  <div className="card ~neutral !low relative h-48">
                    <h3 className="subheading text-2xl">{c.Name}</h3>
                    <h4>{c.Products.length} proizvoda</h4>
                    {c.Image.URL && (
                      <img
                        src={c.Image.URL}
                        alt="slika kategorije"
                        className="absolute right-0 bottom-0 m-4"
                        width="120px"
                        height="120px"
                      />
                    )}
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
        <li>
          <a href="https://pioneer.hr" target="_blank">
            <div className="card ~neutral !low relative h-48">
              <div className="flex justify-between items-baseline">
                <h3 className="subheading text-2xl truncate">PioneerDJ Hrvatska</h3>
                <ExternalLink />
              </div>
              <h4>Autorizirani shop PioneerDJ opreme i uređaja za Hrvatsku.</h4>
              <img
                src="https://pioneer.hr/img/my-shop-logo-1430300787.jpg"
                alt="pioneer.hr logo"
                className="absolute right-0 bottom-0 m-4 mb-5"
              />
            </div>
          </a>
        </li>
      </ul>
      <h2 className="heading text-4xl mt-12 mb-5">Izdvojeni proizvodi</h2>
      <ProductList
        products={products}
        setCart={setCart}
        setCartOpened={setCartOpened}
        dispatchAlert={dispatchAlert}
      />
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getStaticProps() {
  const categoriesRes = await fetch("https://api.amadeus2.hr/categories/");
  let categories = await categoriesRes.json();

  const products = categories.find((c) => c.Slug === "amadeus-ii-shop").Products;

  const whitelistedCategories = [
    "klima-uredaji",
    "televizori",
    "ps4-gaming",
    "racunala",
    "pametni-mobiteli-smartphone",
  ];
  categories = categories
    .filter((c) => whitelistedCategories.includes(c.Slug))
    .sort((a, b) => b.Products.length - a.Products.length);

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
