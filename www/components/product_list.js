import ProductCard from "./product_card";
import { getFilters, getFilteredList, getSortedList } from "../helpers/filter";
import { useState, useEffect } from "react";
import { ArrowDown } from "react-feather";
import Router from "next/router";

function ProductList({ products, setCart, dispatchAlert, hideCategories }) {
  if (!products || !products.length) {
    return <div>no products</div>;
  }

  const filters = getFilters(products);
  const pageSize = 30;
  const [selected, setSelected] = useState({
    category: "",
    feature: {
      name: "",
      value: "",
    },
  });
  const [limit, setLimit] = useState(pageSize);
  const [filteredList, setFilteredList] = useState(getFilteredList(products, selected));
  const [sort, setSort] = useState("/");

  useEffect(() => setSort(""), []);
  Router.events.on("routeChangeComplete", () => setSort(""));
  Router.events.on("routeChangeError", () => setSort(""));

  useEffect(() => {
    setFilteredList(getFilteredList(products, selected));
    setLimit(pageSize);
  }, [products, selected]);

  return (
    <div className="flex lg:flex-row flex-col">
      <div className="xl:w-1/6 lg:w-1/4 mr-5 overflow-hidden">
        <div>
          <h3 className="subheading mx-1 mt-1 mb-2">Sortiraj po</h3>
          <div className="select !normal m-1">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Relevantnosti</option>
              <option value="a-z">Nazivu: A do Z</option>
              <option value="z-a">Nazivu: Z do A</option>
              <option value="min-max">Cijeni: niža prema višoj</option>
              <option value="max-min">Cijeni: viša prema nižoj</option>
            </select>
          </div>
        </div>
        {filters.categories.length > 0 && !hideCategories && (
          <div>
            <h3 className="subheading mx-1 mt-6 mb-2">Kategorije</h3>
            <div>
              {filters.categories.map((c) => {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      const category = selected.category !== c ? c : "";
                      setSelected({
                        ...selected,
                        category,
                      });
                    }}
                    className={`button ${
                      selected.category === c ? "~positive" : "~neutral"
                    } !normal m-1`}
                    key={c}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {filters.features.length > 0 && (
          <div>
            <h3 className="subheading mx-1 mt-6 mb-2">Značajke</h3>
            <div>
              {filters.features.map((f) => {
                return (
                  <div className="inline" key={f.name}>
                    <button
                      type="button"
                      onClick={() => {
                        const name = selected.feature.name !== f.name ? f.name : "";
                        setSelected({
                          ...selected,
                          feature: {
                            name,
                            value: "",
                          },
                        });
                      }}
                      className={`button ${
                        selected.feature.name === f.name ? "~positive" : "~neutral"
                      } !normal m-1`}
                    >
                      {f.name}
                    </button>
                    {selected.feature.name === f.name && (
                      <div>
                        <hr className="m-1" />
                        {f.values.map((v) => {
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                const value = selected.feature.value !== v ? v : "";
                                setSelected({
                                  ...selected,
                                  feature: {
                                    ...selected.feature,
                                    value,
                                  },
                                });
                              }}
                              className={`button ${
                                selected.feature.value === v ? "~urge" : "~neutral"
                              } !normal m-1`}
                              key={v}
                            >
                              {v}
                            </button>
                          );
                        })}
                        <hr className="m-1" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="xl:w-5/6 lg:w-3/4">
        <ul className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
          {getSortedList(filteredList, sort)
            .slice(0, limit)
            .map((p) => {
              return (
                <ProductCard
                  product={p}
                  setCart={setCart}
                  dispatchAlert={dispatchAlert}
                  key={p.ID}
                />
              );
            })}
        </ul>
        <div className="flex justify-center items-center flex-wrap mt-10">
          <span className="mx-5 my-2">
            Prikazan{filteredList.length != 1 && "o"}{" "}
            {limit < filteredList.length ? limit : filteredList.length} od {filteredList.length}{" "}
            proizvod{filteredList.length != 1 && "a"}
          </span>
          {limit < filteredList.length && (
            <button
              type="button"
              className="button ~neutral !normal px-3 py-2 mx-5"
              onClick={() => setLimit(limit + pageSize)}
            >
              <ArrowDown />
              <span className="text-lg ml-2">Prikaži više proizvoda</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
