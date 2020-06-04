function CartGet() {
  if (!process.browser) return [];

  return JSON.parse(localStorage.getItem("cart")) || [];
}

function CartSave(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function CartAdd(setCart, product, Quantity = 1) {
  const cart = CartGet();
  const i = cart.findIndex((p) => p.ID === product.ID);

  if (i !== -1) {
    cart[i].Quantity += Quantity;
  } else {
    product = { ...product, Quantity };
    cart.push(product);
  }

  CartSave(cart);
  setCart(cart);
}

function CartSetQuantity(setCart, product, Quantity) {
  const cart = CartGet();
  const i = cart.findIndex((p) => p.ID === product.ID);

  cart[i].Quantity = Quantity;

  CartSave(cart);
  setCart(cart);
}

function CartRemove(setCart, product) {
  const cart = CartGet().filter((p) => p.ID !== product.ID);

  CartSave(cart);
  setCart(cart);
}

export { CartGet, CartAdd, CartSetQuantity, CartRemove };
