import { useState } from "react";
import Router from "next/router";
import NProgress, { remove } from "nprogress";
import Cart from "../components/cart";
import { cartGet } from "../helpers/cart";
import Header from "../components/header";
import Footer from "../components/footer";
import "lazysizes";
import "rc-drawer/assets/index.css";
import "nprogress/nprogress.css";
import "a17t";
import "../public/css/styles.css";
import Alert from "../components/alert";

function App({ Component, pageProps }) {
  const [cart, setCart] = useState(cartGet());
  const [query, setQuery] = useState("");
  const [alerts, setAlerts] = useState([]);
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

  const dispatchAlert = (message) => {
    const id = alerts.length > 0 ? alerts[alerts.length - 1].id++ : 0;
    setAlerts([...alerts, { id, message }]);
  };
  const removeAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id != id));
  };

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
        dispatchAlert={dispatchAlert}
      />
      <Footer />
      <ul className="fixed bottom-0 ml-5 mb-5">
        {alerts
          .sort((a, b) => a.id - b.id)
          .map((a) => {
            return <Alert message={a.message} id={a.id} removeAlert={removeAlert} key={a.id} />;
          })}
      </ul>
      <Cart cart={cart} setCart={setCart} cartOpened={cartOpened} setCartOpened={setCartOpened} />
    </div>
  );
}

export default App;

/*
TODO:
	images in popular categories cards
	footer (links, legal docs in md)
	front page (google maps, contact, contact form)
	product page (image gallery, similar products)
	checkout
	mobile design
	category tree styles
*/
