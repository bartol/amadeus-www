import NextApp from "next/app";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";

class App extends NextApp {
  render() {
    const { Component } = this.props;
    return (
      <ThemeProvider>
        <CSSReset />
        <Component />
      </ThemeProvider>
    );
  }
}

export default App;
