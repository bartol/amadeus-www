import { useState } from "react";
import { Router } from "next/router";
import Cart from "../components/cart";
import { cartGet } from "../helpers/cart";
import Header from "../components/header";
import Footer from "../components/footer";
import "lazysizes";
import "rc-drawer/assets/index.css";
import "a17t";
import "../public/css/styles.css";

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
      <Footer />
      <Cart cart={cart} setCart={setCart} cartOpened={cartOpened} setCartOpened={setCartOpened} />
    </div>
  );
}

export default App;

/*
TODO:
	sortiranje
	filters spacing and overflow
	square images in product cards
	images in popular categories cards
	footer (links, legal docs in md)
	search (suggestions popup and full interface)
	front page (google maps, contact, contact form)
	product page (image gallery, similar products)
	checkout
	category tree styles
*/
