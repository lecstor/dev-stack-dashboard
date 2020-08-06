import React, { FC } from "react";
import { FaCheckCircle } from "react-icons/fa";

import { Box, List, ListItem, ListIcon } from "@chakra-ui/core";

import useReadDockerDir from "./useReadDockerDir";

import TitleBar from "./TitleBar";

const Root: FC = () => {
  const readDirResult = useReadDockerDir({
    path: "/Users/jason/compono",
    directoriesOnly: true,
  });
  const { files } = readDirResult || {};

  console.log(files);
  return (
    <div>
      <TitleBar />
      <Box p={4}> Hi from Electron, React, and Chakra-UI!</Box>
      <List>
        {files?.map(({ name, gitStatus }) => (
          <ListItem key={name}>
            <ListIcon as={FaCheckCircle} color="green.500" /> {name} - git:{" "}
            {gitStatus?.current} -{gitStatus.behind} +{gitStatus.ahead}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Root;
