import React, { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Accordion, Box, Heading } from "@chakra-ui/core";

import { fetchStack, getSettings, setSettingsStackState } from "../ipc";
import useInterval from "../hooks/useInterval";

import { setComposeConfig } from "../store/configSlice";
import { selectServicesBySourceTypes } from "../store/configSelectors";

import { setDockerPs } from "../store/dockerSlice";
import { selectDockerPs } from "../store/dockerSelectors";

import Service from "./Service";

const DevStack: FC<{ path: string }> = ({ path }) => {
  const dispatch = useDispatch();
  const importedServices = useSelector(selectServicesBySourceTypes(["image"]));
  const localServices = useSelector(
    selectServicesBySourceTypes(["build", "mount"])
  );
  const dockerPs = useSelector(selectDockerPs);

  const refreshStack = () =>
    fetchStack(path).then((result) => {
      dispatch(setComposeConfig(result.composeConfig));
      dispatch(setDockerPs(result.dockerPs));
      setSettingsStackState(result);
    });

  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (settings.stack) {
          dispatch(setComposeConfig(settings.stack.composeConfig));
        }
      })
      .then(refreshStack);
  }, []);

  useInterval(refreshStack, 30000);

  return (
    <>
      {localServices ? (
        <>
          <Heading size="sm" m={2} ml={4}>
            Built from local source files
          </Heading>
          <Box borderX="1px solid rgba(255, 255, 255, 0.16)" m={4} mb={8}>
            <Accordion allowToggle>
              {localServices.map((service) => {
                return (
                  <Service
                    key={service.name}
                    name={service.name}
                    path={service.path}
                    sourceType={service.sourceType}
                    dockerPs={dockerPs?.[service.name]}
                  />
                );
              })}
            </Accordion>
          </Box>
        </>
      ) : null}

      {importedServices ? (
        <>
          <Heading size="sm" m={2} ml={4}>
            Images pulled from remote repository
          </Heading>
          <Box borderX="1px solid rgba(255, 255, 255, 0.16)" m={4} mb={8}>
            <Accordion allowToggle>
              {importedServices.map((service) => {
                return (
                  <Service
                    key={service.name}
                    name={service.name}
                    sourceType={service.sourceType}
                    dockerPs={dockerPs?.[service.name]}
                  />
                );
              })}
            </Accordion>
          </Box>
        </>
      ) : null}
    </>
  );
};

export default DevStack;
