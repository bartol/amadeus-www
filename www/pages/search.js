import ProductList from "../components/product_list";
import Menu from "../components/menu";

function Search({ query, results, categoriesTree, setCart, menuOpened, setMenuOpened }) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="heading text-4xl mt-12 mb-5">Rezultati pretrage "{query}"</h1>
      <ProductList products={results} setCart={setCart} />
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const resultsData = await fetch(
    `https://api.amadeus2.hr/search/?query=${encodeURIComponent(query.q)}`
  );
  const results = await resultsData.json();

  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  return {
    props: {
      query: query.q,
      results,
      categoriesTree,
    },
  };
}

export default Search;
