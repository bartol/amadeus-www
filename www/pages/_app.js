import { SharedStateProvider } from "../state/shared";
import "../public/styles.css";

function App({ Component, pageProps }) {
  return (
    <SharedStateProvider>
      <Component {...pageProps} />
    </SharedStateProvider>
  );
}

export default App;
