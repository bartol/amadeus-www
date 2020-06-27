import ProductList from "../components/product_list";
import Menu from "../components/menu";
import SEO from "../components/seo.js";

function Search({
  query,
  results,
  hasResults,
  categoriesTree,
  setCart,
  menuOpened,
  setMenuOpened,
  dispatchAlert,
}) {
  return (
    <div className="container mx-auto px-4">
      {hasResults ? (
        <div>
          <SEO
            title={`Rezultati pretrage "${query}" | Amadeus II d.o.o. shop`}
            description={`Rezultati pretrage "${query}"`}
            path={`search/?q=${encodeURIComponent(query)}`}
          />
          <h1 className="heading text-4xl mt-12 mb-5">Rezultati pretrage "{query}"</h1>
          <ProductList products={results} setCart={setCart} dispatchAlert={dispatchAlert} />
        </div>
      ) : (
        <div>search box</div>
      )}
      <Menu categories={categoriesTree} menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
    </div>
  );
}

export async function getServerSideProps({ query: { q } }) {
  const categoriesTreeRes = await fetch("https://api.amadeus2.hr/categories/tree");
  const categoriesTree = await categoriesTreeRes.json();

  if (!q) {
    return {
      props: {
        query: "",
        results: [],
        hasResults: false,
        categoriesTree,
      },
    };
  }

  const resultsData = await fetch(`https://api.amadeus2.hr/search/?query=${encodeURIComponent(q)}`);
  const results = await resultsData.json();

  return {
    props: {
      query: q,
      results,
      hasResults: true,
      categoriesTree,
    },
  };
}

export default Search;
