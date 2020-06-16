import { getReductedPrice } from "./price";

function getFilters(list) {
  const filters = {
    categories: [],
    features: [],
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
  });

  return filters;
}

function getFilteredList(list, filters) {
  let filtered = list;

  if (filters.category) {
    filtered = filtered.filter((p) => p.Categories.some((c) => c.Name === filters.category));
  }

  if (filters.feature.value) {
    filtered = filtered.filter((p) =>
      p.Features.some((f) => f.Name === filters.feature.name && f.Value === filters.feature.value)
    );
  }

  return filtered;
}

function getSortedList(list, sort) {
  switch (sort) {
    case "a-z":
      return [...list].sort((a, b) => {
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1;
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) return -1;
        return 0;
      });
    case "z-a":
      return [...list].sort((a, b) => {
        if (a.Name.toLowerCase() > b.Name.toLowerCase()) return -1;
        if (a.Name.toLowerCase() < b.Name.toLowerCase()) return 1;
        return 0;
      });
    case "min-max":
      return [...list].sort((a, b) => {
        const aPrice = a.HasReduction
          ? getReductedPrice(a.Price, a.Reduction, a.ReductionType, true)
          : a.Price;
        const bPrice = b.HasReduction
          ? getReductedPrice(b.Price, b.Reduction, b.ReductionType, true)
          : b.Price;
        return aPrice - bPrice;
      });
    case "max-min":
      return [...list].sort((a, b) => {
        const aPrice = a.HasReduction
          ? getReductedPrice(a.Price, a.Reduction, a.ReductionType, true)
          : a.Price;
        const bPrice = b.HasReduction
          ? getReductedPrice(b.Price, b.Reduction, b.ReductionType, true)
          : b.Price;
        return bPrice - aPrice;
      });
    default:
      return list;
  }
}

export { getFilters, getFilteredList, getSortedList };
