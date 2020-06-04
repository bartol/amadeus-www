function cartGet() {
  if (!process.browser) return [];

  return JSON.parse(localStorage.getItem("cart")) || [];
}

function cartSave(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function cartAdd(setCart, product, Quantity = 1) {
  const cart = cartGet();
  const i = cart.findIndex((p) => p.ID === product.ID);

  if (i !== -1) {
    cart[i].Quantity += Quantity;
  } else {
    product = { ...product, Quantity };
    cart.push(product);
  }

  cartSave(cart);
  setCart(cart);
}

function cartSetQuantity(setCart, product, Quantity) {
  const cart = cartGet();
  const i = cart.findIndex((p) => p.ID === product.ID);

  cart[i].Quantity = Quantity;

  cartSave(cart);
  setCart(cart);
}

function cartRemove(setCart, product) {
  const cart = cartGet().filter((p) => p.ID !== product.ID);

  cartSave(cart);
  setCart(cart);
}

export { cartGet, cartAdd, cartSetQuantity, cartRemove };
