import React, { FC } from "react";

import { Box } from "@chakra-ui/core";

import useReadDockerDir from "./useReadDockerDir";

import TitleBar from "./TitleBar";
import RepoList from "./RepoList";

const Root: FC = () => {
  const readDirResult = useReadDockerDir({
    path: "/Users/jason/compono",
    directoriesOnly: true,
  });
  const { files } = readDirResult || {};

  return (
    <div>
      <TitleBar />
      <Box p={4}> Hi from Electron, React, and Chakra-UI!</Box>
      <RepoList path="/Users/jason/compono" />
    </div>
  );
};

export default Root;
