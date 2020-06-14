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

export { getFilters, getFilteredList };
