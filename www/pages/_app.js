import { useState } from "react";
import Cart from "../components/cart";
import { cartGet } from "../helpers/cart";
import "rc-drawer/assets/index.css";
import "a17t";
import "../public/styles.css";

function App({ Component, pageProps }) {
  const [cart, setCart] = useState(cartGet());

  return (
    <div className="bg-gray-100">
      <Cart cart={cart} setCart={setCart} />
      <Component {...pageProps} cart={cart} setCart={setCart} />
    </div>
  );
}

export default App;
