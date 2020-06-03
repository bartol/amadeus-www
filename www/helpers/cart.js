function CartAdd(setState, product, Quantity = 1) {
  setState((prev) => {
    const cart = prev.cart;
    const i = cart.findIndex((p) => p.ID === product.ID);

    if (i !== -1) {
      cart[i].Quantity += Quantity;
    } else {
      product = { ...product, Quantity };
      cart.push(product);
    }

    return { ...prev, cart };
  });
}

export { CartAdd };
