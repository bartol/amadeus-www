import { useState, useEffect } from "react";
import { Search as SearchIcon } from "react-feather";
import Link from "next/link";
import SearchSuggestions from "./search_suggestions";
import SearchBox from "./search_box";

function Search({ query, setQuery }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    (async function () {
      const data = await fetch(
        `https://api.amadeus2.hr/search/?query=${encodeURIComponent(query)}&limit=3`
      );
      const products = await data.json();
      setResults(products);
    })();
  }, [query]);

  return (
    <div className="relative px-4">
      <div className="flex items-center">
        <Link href="/">
          <a className="mr-4">
            <img src="/img/logo.png" alt="Amadeus II d.o.o." className="w-40 xs:block hidden" />
            <img src="/img/icon.png" alt="Amadeus II d.o.o." className="w-10 xs:hidden" />
          </a>
        </Link>
        <div className="md:block hidden">
          <SearchBox query={query} setQuery={setQuery} />
        </div>
        <Link href="/search">
          <a className="button ~neutral !normal px-3 py-2 md:hidden">
            <SearchIcon />
          </a>
        </Link>
      </div>
      <SearchSuggestions query={query} results={results} />
    </div>
  );
}

export default Search;
