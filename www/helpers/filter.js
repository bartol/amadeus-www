import { getReductedPrice } from "./price";

function getFilters(list) {
  const filters = {
    categories: [],
    features: [],
    price: {
      min: 0,
      max: 0,
    },
  };

  list.forEach((p) => {
    p.Categories.forEach((c) => {
      if (!filters.categories.includes(c.Name) && c.Name !== "Home") {
        filters.categories.push(c.Name);
      }
    });

    p.Features.forEach((f) => {
      const i = filters.features.findIndex((ft) => ft.name === f.Name);
      if (i !== -1) {
        const feature = filters.features[i];
        if (!feature.values.includes(f.Value)) {
          feature.values.push(f.Value);
        }
      } else {
        filters.features.push({
          name: f.Name,
          values: [f.Value],
        });
      }
    });

    const price = p.HasReduction
      ? getReductedPrice(p.Price, p.Reduction, p.ReductionType, true)
      : p.Price;
    if (price < filters.price.min || filters.price.min === 0) {
      filters.price.min = price;
    }
    if (price > filters.price.max) {
      filters.price.max = price;
    }
  });

  return filters;
}

export { getFilters };
