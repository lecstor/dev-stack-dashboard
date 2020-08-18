import React, { FC, useEffect } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  Box,
  Flex,
  Tooltip,
} from "@chakra-ui/core";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

import { readRepo } from "../ipc";
import { RepoDetailMeta } from "../../types";
import formatSinceLastFetch from "./getSinceLastFetch";

interface RepoSchema {
  states: {
    idle: Record<string, unknown>;
    loading: Record<string, unknown>;
    loaded: {
      states: {
        idle: Record<string, unknown>;
        refreshing: Record<string, unknown>;
        failure: Record<string, unknown>;
      };
    };
    failure: Record<string, unknown>;
  };
}

type RepoEvent = { type: "FETCH" | "RETRY" | "REFRESH" };

type RepoContext = {
  path: string;
  meta: RepoDetailMeta;
  error: Error;
};

// This machine is completely decoupled from React
export const repoMachine = Machine<RepoContext, RepoSchema, RepoEvent>({
  id: "repo",
  initial: "idle",
  states: {
    idle: {
      on: { FETCH: "loading" },
    },
    loading: {
      invoke: {
        src: (ctx) => readRepo(ctx.path),
        onDone: {
          target: "#repo.loaded",
          actions: assign({ meta: (ctx, event) => event.data }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: (ctx, event) => event.data }),
        },
      },
    },
    loaded: {
      initial: "idle",
      states: {
        idle: {
          on: { REFRESH: "refreshing" },
        },
        refreshing: {
          invoke: {
            src: (ctx) => readRepo(ctx.path),
            onDone: {
              target: "idle",
              actions: assign({ meta: (ctx, event) => event.data }),
            },
            onError: {
              target: "failure",
              actions: assign({ error: (ctx, event) => event.data }),
            },
          },
        },
        failure: {
          on: {
            RETRY: "refreshing",
          },
        },
      },
    },
    failure: {
      on: {
        RETRY: "loading",
      },
    },
  },
});

const Repo: FC<{ path: string; name: string; loadAt: string }> = ({
  path,
  name,
  loadAt,
  ...props
}) => {
  const [state, send] = useMachine(repoMachine, { context: { path } });

  useEffect(() => {
    switch (true) {
      case state.matches("idle"): {
        send("FETCH");
        break;
      }
      case state.matches("loaded.idle"): {
        send("REFRESH");
        break;
      }
    }
  }, [loadAt]);

  if (state.matches("loaded")) {
    const { gitStatus, behindMaster, lastFetchAt } = state.context.meta;
    const sinceLastFetch = formatSinceLastFetch(lastFetchAt);

    return (
      <AccordionItem {...props}>
        <AccordionButton>
          <Flex
            flex="1"
            textAlign="left"
            alignItems="center"
            flexDirection="row"
          >
            {behindMaster ? (
              <Tooltip
                label={`${name} is ${behindMaster} commits behind origin/master`}
                aria-label="A tooltip"
              >
                <Box color="orange.500">
                  <FaExclamationCircle />
                </Box>
              </Tooltip>
            ) : (
              <Box color="green.500">
                <FaCheckCircle />
              </Box>
            )}
            <Box ml={2}>{name}</Box>
          </Flex>
          <Box mr={8}>
            <Code>{gitStatus?.current}</Code>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pl={10} pb={4}>
          <div>
            {gitStatus
              ? `${gitStatus.behind ? `behind: ${gitStatus.behind}` : ""} ${
                  gitStatus.ahead ? `ahead: ${gitStatus.ahead}` : ""
                }`
              : ""}
          </div>
          {behindMaster ? (
            <div>
              origin/master has {behindMaster} new commit
              {behindMaster > 1 ? "s" : ""}
            </div>
          ) : null}
          <div>more than {sinceLastFetch} since last fetch</div>
        </AccordionPanel>
      </AccordionItem>
    );
  } else {
    return (
      <AccordionItem>
        <AccordionButton>{name}</AccordionButton>
      </AccordionItem>
    );
  }
};

export default Repo;
