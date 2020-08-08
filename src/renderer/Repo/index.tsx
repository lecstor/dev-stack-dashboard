import React, { FC, useEffect } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { ListItem, ListIcon, Tooltip } from "@chakra-ui/core";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

import { readRepo } from "../ipc";
import { RepoDetailMeta } from "../../main/ipcHandlers";
import getSinceLastFetch from "./getSinceLastFetch";

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
        src: (ctx, event) => readRepo(ctx.path),
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
            src: (ctx, event) => readRepo(ctx.path),
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

const Repo: FC<{ path: string; name: string }> = ({ path, name }) => {
  const [state, send] = useMachine(repoMachine, { context: { path } });

  useEffect(() => {
    send("FETCH");
  }, []);

  if (state.matches("loaded")) {
    const { gitStatus, commitsBehindMaster, lastFetchAt } = state.context.meta;
    const sinceLastFetch = getSinceLastFetch(lastFetchAt);

    return (
      <ListItem>
        {commitsBehindMaster ? (
          <Tooltip
            label={`${name} is ${commitsBehindMaster} commits behind origin/master`}
            aria-label="A tooltip"
          >
            <span>
              <ListIcon as={FaExclamationCircle} color="orange.500" />
            </span>
          </Tooltip>
        ) : (
          <ListIcon as={FaCheckCircle} color="green.500" />
        )}{" "}
        <span>
          {name}
          <div>
            {gitStatus
              ? `- git: ${gitStatus?.current} -${gitStatus.behind} +
            ${gitStatus.ahead}`
              : ""}
          </div>
          {commitsBehindMaster ? (
            <div>
              origin/master has {commitsBehindMaster} new commit
              {commitsBehindMaster > 1 ? "s" : ""}
            </div>
          ) : null}
          <div>{sinceLastFetch} since last fetch</div>
        </span>
      </ListItem>
    );
  } else {
    return (
      <ListItem>
        <ListIcon as={FaCheckCircle} color="green.500" /> {name}
      </ListItem>
    );
  }
};

export default Repo;
