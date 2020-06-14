import ProductCard from "./product_card";
import { getFilters, getFilteredList } from "../helpers/filter";
import { useState, useEffect } from "react";
import { Range } from "rc-slider";
import { getPrice } from "../helpers/price";

function ProductList({ products, setCart }) {
  if (!products || !products.length) {
    return <div>no products</div>;
  }

  const filters = getFilters(products);
  const [selected, setSelected] = useState({
    page: {
      current: filters.page.current,
    },
    category: "",
    feature: {
      name: "",
      value: "",
    },
    price: {
      min: filters.price.min,
      max: filters.price.max,
    },
  });

  const [filteredList, setFilteredList] = useState(
    getFilteredList(products, selected, filters.price)
  );
  useEffect(() => {
    setFilteredList(getFilteredList(products, selected, filters.price));
  }, [products, selected]);

  return (
    <div className="flex lg:flex-row flex-col">
      <div className="xl:w-1/6 lg:w-1/4 mr-5">
        {filters.categories.length > 1 && (
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
        <h3 className="subheading">Cijena</h3>
        <div className="mx-3 my-1">
          <Range
            min={filters.price.min}
            max={filters.price.max}
            defaultValue={[filters.price.min, filters.price.max]}
            onAfterChange={(p) => {
              const [min, max] = p;
              setSelected({ ...selected, price: { min, max } });
            }}
          />
        </div>
        <div className="flex justify-between m-1">
          <h4>{getPrice(selected.price.min)}</h4>
          <h4>{getPrice(selected.price.max)}</h4>
        </div>
      </div>
      <ul className="xl:w-5/6 lg:w-3/4 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
        {filteredList.map((p) => {
          return <ProductCard product={p} key={p.ID} setCart={setCart} />;
        })}
      </ul>
    </div>
  );
}

export default ProductList;
