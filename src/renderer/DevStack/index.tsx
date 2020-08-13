import React, { FC, useEffect, useState } from "react";

import { Accordion, Box, Heading } from "@chakra-ui/core";

import { fetchStack, getSettings, setSettingsStackState } from "../ipc";
import { DevStack as DevStackType } from "../../types";
import useInterval from "../hooks/useInterval";

import Service from "./Service";

const DevStack: FC<{ path: string }> = ({ path }) => {
  const [stack, setStack] = useState<DevStackType>();

  const refreshStack = () =>
    fetchStack(path).then((result) => {
      setStack(result);
      setSettingsStackState(result);
    });

  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (settings.stack) {
          setStack(settings.stack);
        }
      })
      .then(refreshStack);
  }, []);

  useInterval(refreshStack, 30000);

  const services = stack ? Object.keys(stack?.composeState) : [];

  const localServices = services
    .sort()
    .filter((name) => stack?.composeState[name]?.state !== "image");
  const masterServices = services
    .sort()
    .filter((name) => stack?.composeState[name]?.state === "image");

  return (
    <>
      <Heading size="sm" m={2} ml={4}>
        Local source
      </Heading>
      <Box borderX="1px solid rgba(255, 255, 255, 0.16)" m={4} mb={8}>
        <Accordion allowToggle>
          {localServices.map((name) => {
            const state = stack?.composeState[name]?.state;
            return (
              <Service
                key={name}
                name={name}
                path={stack?.composeState[name]?.path}
                state={state}
                dockerPs={stack?.dockerPs?.[name]}
              />
            );
          })}
        </Accordion>
      </Box>
      <Heading size="sm" m={2} ml={4}>
        Master images
      </Heading>
      <Box borderX="1px solid rgba(255, 255, 255, 0.16)" m={4}>
        <Accordion allowToggle>
          {masterServices.map((name) => {
            const state = stack?.composeState[name]?.state;
            return (
              <Service
                key={name}
                name={name}
                state={state}
                dockerPs={stack?.dockerPs?.[name]}
              />
            );
          })}
        </Accordion>
      </Box>
      <pre>{JSON.stringify(stack?.composeState, null, 2)}</pre>
      <pre>{JSON.stringify(stack?.dockerPs, null, 2)}</pre>
    </>
  );
};

export default DevStack;
