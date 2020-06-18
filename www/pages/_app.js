import { useState } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import Cart from "../components/cart";
import { cartGet } from "../helpers/cart";
import Header from "../components/header";
import Footer from "../components/footer";
import "lazysizes";
import "rc-drawer/assets/index.css";
import "nprogress/nprogress.css";
import "a17t";
import "../public/css/styles.css";

function App({ Component, pageProps }) {
  const [cart, setCart] = useState(cartGet());
  const [query, setQuery] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

  const cleanup = () => {
    setCartOpened(false);
    setMenuOpened(false);
    setQuery("");
    NProgress.done();
  };
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => cleanup());
  Router.events.on("routeChangeError", () => cleanup());

  return (
    <div className="bg-gray-100">
      <Header
        query={query}
        setQuery={setQuery}
        setCartOpened={setCartOpened}
        setMenuOpened={setMenuOpened}
      />
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
	filters spacing and overflow
	images in popular categories cards
	footer (links, legal docs in md)
	search (suggestions popup and full interface)
	front page (google maps, contact, contact form)
	product page (image gallery, similar products)
	checkout
	alerts (add to cart...) left bottom corner
	mobile design
	category tree styles
	getCheckoutPrice (to replace if p.HasReduction...)
*/
