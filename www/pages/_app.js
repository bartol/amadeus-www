import { SharedStateProvider } from "../state/shared";
import Cart from "../components/cart";
import "../public/styles.css";
import "a17t";
import "rc-drawer/assets/index.css";

function App({ Component, pageProps }) {
  return (
    <SharedStateProvider>
      <Cart />
      <Component {...pageProps} />
    </SharedStateProvider>
  );
}

export default App;
