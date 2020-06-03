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

function CartSetQuantity(setState, product, Quantity) {
  setState((prev) => {
    const cart = prev.cart;
    const i = cart.findIndex((p) => p.ID === product.ID);

    cart[i].Quantity = Quantity;

    return { ...prev, cart };
  });
}

function CartRemove(setState, product) {
  setState((prev) => {
    const cart = prev.cart.filter((p) => p.ID !== product.ID);
    return { ...prev, cart };
  });
}

export { CartAdd, CartSetQuantity, CartRemove };
