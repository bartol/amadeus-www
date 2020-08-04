import { useState, useEffect } from "react";
import Router from "next/router";
import Head from "next/head";
import NProgress from "nprogress";
import Cart from "../components/cart";
import { cartGet } from "../helpers/cart";
import Header from "../components/header";
import Footer from "../components/footer";
import Alert from "../components/alert";
import "lazysizes";
import "rc-drawer/assets/index.css";
import "glider-js/glider.min.css";
import "nprogress/nprogress.css";
import "a17t";
import "../public/css/styles.css";
import { orderInit, couponInit } from "../helpers/order";

function App({ Component, pageProps }) {
  const [cart, setCart] = useState(cartGet());
  const [order, setOrder] = useState(orderInit);
  const [coupon, setCoupon] = useState(couponInit);
  const [query, setQuery] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

  const cleanup = (url) => {
    setCartOpened(false);
    setMenuOpened(false);
    setQuery("");
    window.ga("send", "pageview", url);
    NProgress.done();
  };
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", cleanup);
  Router.events.on("routeChangeError", cleanup);

  const dispatchAlert = (message, colorClass, Icon, timeout, onClick) => {
    const id = alerts.length > 0 ? alerts[alerts.length - 1].id + 1 : 0;
    setAlerts([...alerts, { id, message, colorClass, Icon, timeout, onClick }]);
  };
  const removeAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id != id));
  };

  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);

  return (
    <div className="bg-gray-100">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
              
              ga('create', 'UA-173407510-1', 'auto');
              ga('send', 'pageview');
        `,
          }}
        />
      </Head>
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
        setCartOpened={setCartOpened}
        dispatchAlert={dispatchAlert}
      />
      <Footer dispatchAlert={dispatchAlert} />
      <ul className="fixed bottom-0 m-4" style={{ zIndex: 10000 }}>
        {alerts
          .sort((a, b) => a.id - b.id)
          .map((a) => {
            return (
              <Alert
                message={a.message}
                id={a.id}
                colorClass={a.colorClass}
                Icon={a.Icon}
                timeout={a.timeout}
                onClick={a.onClick}
                removeAlert={removeAlert}
                key={a.id}
              />
            );
          })}
      </ul>
      <Cart
        cart={cart}
        setCart={setCart}
        order={order}
        setOrder={setOrder}
        cartOpened={cartOpened}
        setCartOpened={setCartOpened}
        coupon={coupon}
        setCoupon={setCoupon}
        dispatchAlert={dispatchAlert}
      />
    </div>
  );
}

export default App;
