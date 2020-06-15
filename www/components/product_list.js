import ProductCard from "./product_card";
import { getFilters, getFilteredList } from "../helpers/filter";
import { useState, useEffect } from "react";
import { ArrowDown } from "react-feather";

function ProductList({ products, setCart, showCategories }) {
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

  useEffect(() => {
    setFilteredList(getFilteredList(products, selected));
    setLimit(pageSize);
  }, [products, selected]);

  return (
    <div className="flex lg:flex-row flex-col">
      <div className="xl:w-1/6 lg:w-1/4 mr-5 overflow-hidden">
        {filters.categories.length > 0 && showCategories && (
          <div>
            <h3 className="subheading">Kategorije</h3>
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
            <h3 className="subheading">Značajke</h3>
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
          {filteredList.slice(0, limit).map((p) => {
            return <ProductCard product={p} key={p.ID} setCart={setCart} />;
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
