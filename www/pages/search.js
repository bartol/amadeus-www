import { useState, useEffect } from "react";
import ProductList from "../components/product_list";
import Menu from "../components/menu";
import SEO from "../components/seo.js";
import SearchBox from "../components/search_box.js";
import SearchSuggestions from "../components/search_suggestions";

function Search({
  query,
  results,
  hasQuery,
  hasResults,
  categoriesTree,
  setCart,
  setCartOpened,
  menuOpened,
  setMenuOpened,
  dispatchAlert,
}) {
  const [localQuery, setLocalQuery] = useState("");
  const [localResults, setLocalResults] = useState([]);

  useEffect(() => {
    if (!localQuery) {
      setLocalResults([]);
      return;
    }

    (async function () {
      const data = await fetch(
        `https://api.amadeus2.hr/search/?query=${encodeURIComponent(localQuery)}&limit=3`
      );
      const products = await data.json();
      setLocalResults(products);
    })();
  }, [localQuery]);

  return (
    <div className="container mx-auto px-4">
      {hasQuery ? (
        <div>
          <SEO
            title={`Rezultati pretrage "${query}" | Amadeus II d.o.o. shop`}
            description={`Rezultati pretrage "${query}"`}
            path={`search/?q=${encodeURIComponent(query)}`}
          />
          <h1 className="heading text-4xl mt-12 mb-5">Rezultati pretrage "{query}"</h1>
          {hasResults ? (
            <ProductList
              products={results}
              setCart={setCart}
              setCartOpened={setCartOpened}
              dispatchAlert={dispatchAlert}
            />
          ) : (
            <div>Za Vašu pretragu pronađeno je 0 rezultata.</div>
          )}
        </div>
      ) : (
        <div className="mt-12">
          <div className="relative w-full max-w-lg mx-auto px-4">
            <SearchBox query={localQuery} setQuery={setLocalQuery} fullWidth />
            <SearchSuggestions query={localQuery} results={localResults} />
          </div>
        </div>
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
        hasQuery: false,
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
      hasQuery: true,
      hasResults: results.length > 0,
      categoriesTree,
    },
  };
}

export default Search;
