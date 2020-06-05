import ProductCard from "./product_card";
import { getFilters } from "../helpers/filter";
import { useState, Fragment } from "react";

function ProductList({ products, limit, pagination, pageSize, showCategories, setCart }) {
  let list = [];
  if (products && limit) {
    list = products.slice(0, limit);
  } else if (products) {
    list = products;
  }

  const filters = getFilters(list);
  const [selected, setSelected] = useState({
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

  return (
    <div className="flex">
      <div className="w-1/6 mr-5">
        {showCategories && (
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
        <pre>{JSON.stringify(selected, null, 2)}</pre>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
      <ul className="w-5/6 grid grid-cols-3 gap-4">
        {list.map((p) => {
          if (!p.ID) {
            return null;
          }

          return <ProductCard product={p} key={p.ID} setCart={setCart} />;
        })}
      </ul>
    </div>
  );
}

export default ProductList;
