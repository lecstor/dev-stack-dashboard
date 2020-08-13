import nodePath from "path";

import React, { FC, useEffect, useState } from "react";

import { Alert, AlertIcon, Box, Kbd, Text } from "@chakra-ui/core";

import { getSettings, onDirectoryOpen, setSettingsStackDir } from "./ipc";

import DevStack from "./DevStack";
import TitleBar from "./TitleBar";

function cleanDir(path: string): string {
  const pathObj = nodePath.parse(path);
  return nodePath.join(pathObj.dir, pathObj.base);
}

const Root: FC = () => {
  const [dir, setDir] = useState("");

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings?.stack.path) {
        setDir(cleanDir(settings.stack.path));
      }
    });
    return onDirectoryOpen((event, directory) => {
      const dir = cleanDir(directory);
      setDir(dir);
      setSettingsStackDir(dir);
    });
  });

  return (
    <div>
      <TitleBar />
      {dir ? (
        <>
          <Box p={4}>{dir}</Box>
          <DevStack path={dir} />
        </>
      ) : (
        <Alert status="info">
          <AlertIcon />
          <Text>
            Use
            <Text as="span" mx={2}>
              <Kbd>Cmd</Kbd> + <Kbd>O</Kbd>
            </Text>
            (or the app file menu) to open the directory with your Docker
            Compose file
          </Text>
        </Alert>
      )}
    </div>
  );
};

export default Root;
