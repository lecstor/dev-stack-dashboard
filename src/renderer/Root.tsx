import { hot } from "react-hot-loader";
import React, { FC } from "react";
import { Provider } from "react-redux";

import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import { theme } from "./theme";

import store from "./store";

import App from "./App";

const Root: FC = () => (
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <CSSReset />
      <App />
    </Provider>
  </ChakraProvider>
);

export default hot(module)(Root);
