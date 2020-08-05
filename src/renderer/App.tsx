import React, { FC } from "react";

import { Box } from "@chakra-ui/core";

import TitleBar from "./TitleBar";

const Root: FC = () => (
  <div>
    <TitleBar />
    <Box p={4}> Hi from Electron, React, and Chakra-UI!</Box>
  </div>
);

export default Root;
