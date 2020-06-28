import Link from "next/link";
import { getPrice, getReductedPrice } from "../helpers/price";
import { ArrowRight } from "react-feather";

function SearchSuggestions({ results, query }) {
  return (
    <div
      className="card ~neutral !low absolute w-full -mx-4 mt-1 z-50"
      style={{ visibility: query && results.length ? "visible" : "hidden" }}
    >
      <table className="table">
        <tbody>
          {results.map((p) => {
            return (
              <tr key={p.ID}>
                <td className="xs:block hidden">
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
  );
}

export default SearchSuggestions;
