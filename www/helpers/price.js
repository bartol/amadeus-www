function getPrice(price) {
  const formatter = new Intl.NumberFormat("hr", { minimumFractionDigits: 2 });

  return formatter.format(price / 100) + " kn";
}

function getReductedPrice(price, reduction, reductionType, returnInt) {
  let p;
  if (reductionType === "amount") {
    p = price - reduction;
  }
  if (reductionType == "percentage") {
    p = (price * (100 - reduction)) / 100;
  }

  if (returnInt) return p;

  return getPrice(p);
}

function getReduction(reduction, reductionType) {
  if (reductionType === "amount") {
    return "-" + getPrice(reduction);
  }
  if (reductionType == "percentage") {
    return `-${reduction}%`;
  }
}

function getTotal(products) {
  return products
    .map(
      (p) =>
        (p.HasReduction ? getReductedPrice(p.Price, p.Reduction, p.ReductionType, true) : p.Price) *
        p.Quantity
    )
    .reduce((a, v) => a + v, 0);
}

export { getPrice, getReductedPrice, getReduction, getTotal };
