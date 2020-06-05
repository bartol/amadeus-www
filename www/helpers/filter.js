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
      if (!filters.features.includes(f.Name)) {
        filters.features.push(f.Name);
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
