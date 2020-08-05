import { hot } from "react-hot-loader";
import React, { FC } from "react";

import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import { theme } from "./theme";

import App from "./App";

const Root: FC = () => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    <App />
  </ChakraProvider>
);

export default hot(module)(Root);
