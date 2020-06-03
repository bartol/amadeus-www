function getPrice(price) {
  return price / 100 + " kn";
}

function getReduction(price, reduction, reductionType) {
  let p;
  if (reductionType === "amount") {
    p = price - reduction;
  }
  if (reductionType == "percentage") {
    p = (price * (100 - reduction)) / 100;
  }

  return getPrice(p);
}

export { getPrice, getReduction };
