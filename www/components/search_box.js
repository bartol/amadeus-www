import { useState, useEffect, useRef } from "react";
import { ArrowRight, X, Search } from "react-feather";
import Link from "next/link";
import { getPrice, getReductedPrice } from "../helpers/price";
import Router from "next/router";

function SearchBox({ query, setQuery }) {
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

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
            <img src="/img/logo.png" alt="Amadeus II d.o.o." className="w-40 sm:block hidden" />
            <img src="/img/icon.png" alt="Amadeus II d.o.o." className="w-10 sm:hidden" />
          </a>
        </Link>
        <div className="relative md:block hidden">
          <input
            type="search"
            className="input ~neutral !normal w-auto px-3 text-xl"
            placeholder="Pretraži proizvode"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                Router.push(`/search?q=${encodeURIComponent(query)}`);
                inputRef.current.blur();
              }
            }}
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center mr-2"
            style={{ visibility: query ? "visible" : "hidden" }}
          >
            <button
              type="button"
              className="button ~neutral !normal p-1"
              onClick={() => setQuery("")}
            >
              <X />
            </button>
          </div>
        </div>
        <Link href="/search">
          <a className="button ~neutral !normal px-3 py-2 md:hidden">
            <Search />
          </a>
        </Link>
      </div>
      <div
        className="card ~neutral !low absolute w-full -mx-4 mt-1"
        style={{ visibility: results.length ? "visible" : "hidden" }}
      >
        <table className="table">
          <tbody>
            {results.map((p) => {
              return (
                <tr key={p.ID}>
                  <td>
                    <Link href="/[category]/[slug]" as={"/" + p.URL}>
                      <a>
                        <div className="relative w-16 h-16">
                          <img
                            src={p.DefaultImage.URL + "?options=25,quality=low"}
                            data-src={p.DefaultImage.URL + "?options=80"}
                            alt="slika proizvoda"
                            className="lazyload absolute w-full h-full object-contain"
                          />
                        </div>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href="/[category]/[slug]" as={"/" + p.URL}>
                      <a>
                        <h3>{p.Name}</h3>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <h4 className={`${p.HasReduction ? "line-through" : "font-bold"}`}>
                      {getPrice(p.Price)}
                    </h4>
                    {p.HasReduction && (
                      <h4 className="font-bold whitespace-no-wrap">
                        {getReductedPrice(p.Price, p.Reduction, p.ReductionType)}
                      </h4>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3" className="px-0 pb-0">
                <Link href={`/search?q=${encodeURIComponent(query)}`}>
                  <a className="button ~neutral !normal px-3 py-2 float-right">
                    <span className="text-lg font-normal mr-2">Prikaži više rezultata</span>
                    <ArrowRight />
                  </a>
                </Link>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default SearchBox;
