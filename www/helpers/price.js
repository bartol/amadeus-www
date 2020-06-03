function getPrice(price) {
  return price / 100 + " kn";
}

function getReductionPrice(price, reduction, reductionType) {
  let p;
  if (reductionType === "amount") {
    p = price - reduction;
  }
  if (reductionType == "percentage") {
    p = (price * (100 - reduction)) / 100;
  }

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

export { getPrice, getReductionPrice, getReduction };
