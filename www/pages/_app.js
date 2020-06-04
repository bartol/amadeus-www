import { useState } from "react";
import Cart from "../components/cart";
import { CartGet } from "../helpers/cart";
import "../public/styles.css";
import "a17t";
import "rc-drawer/assets/index.css";

function App({ Component, pageProps }) {
  const [cart, setCart] = useState(CartGet());

  return (
    <div className="bg-gray-100">
      <Cart cart={cart} setCart={setCart} />
      <Component {...pageProps} cart={cart} setCart={setCart} />
    </div>
  );
}

export default App;
