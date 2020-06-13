import { useState } from "react";
import Cart from "../components/cart";
import { cartGet } from "../helpers/cart";
import "rc-drawer/assets/index.css";
import "rc-slider/assets/index.css";
import "a17t";
import "../public/css/styles.css";
import Header from "../components/header";
import { Router } from "next/router";

function App({ Component, pageProps }) {
  const [cart, setCart] = useState(cartGet());
  const [cartOpened, setCartOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

  Router.events.on("routeChangeStart", () => {
    setCartOpened(false);
    setMenuOpened(false);
  });

  return (
    <div className="bg-gray-100">
      <Header setCartOpened={setCartOpened} setMenuOpened={setMenuOpened} />
      <Component
        {...pageProps}
        cart={cart}
        setCart={setCart}
        menuOpened={menuOpened}
        setMenuOpened={setMenuOpened}
      />
      <Cart cart={cart} setCart={setCart} cartOpened={cartOpened} setCartOpened={setCartOpened} />
    </div>
  );
}

export default App;
