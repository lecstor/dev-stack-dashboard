import React, { FC } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { Button, Accordion } from "@chakra-ui/core";

import { readRepoList } from "./ipc";
import { RepoMeta } from "../main/ipcHandlers";

import Repo from "./Repo";

interface RepoListSchema {
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

type RepoListEvent = { type: "FETCH" | "RETRY" | "REFRESH" };

interface RepoListContext {
  path: string;
  list: RepoMeta[];
  loadAt: string;
  error: unknown;
}

// This machine is completely decoupled from React
export const repoListMachine = Machine<
  RepoListContext,
  RepoListSchema,
  RepoListEvent
>({
  id: "repo-list",
  initial: "idle",
  states: {
    idle: {
      on: { FETCH: "loading" },
    },
    loading: {
      invoke: {
        src: (ctx, event) => readRepoList(ctx.path),
        onDone: {
          target: "#repo-list.loaded",
          actions: assign<RepoListContext, { type: string; data: RepoMeta[] }>({
            list: (ctx, event) => event.data,
            loadAt: () => new Date().toISOString(),
          }),
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
            src: (ctx, event) => readRepoList(ctx.path),
            onDone: {
              target: "idle",
              actions: assign<
                RepoListContext,
                { type: string; data: RepoMeta[] }
              >({
                list: (ctx, event) => event.data,
                loadAt: () => new Date().toISOString(),
              }),
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

const onClick = (state: any, send: any) => () => {
  switch (true) {
    case state.matches("idle"):
      return send("FETCH");
    case state.matches("loaded.idle"):
      return send("REFRESH");
    default:
      alert(`no action for current state: ${JSON.stringify(state.value)}`);
  }
};

const buttonLabel = (state: any) => {
  switch (true) {
    case state.matches("idle"):
      return "Load";
    case state.matches("loading"):
      return "Loading";
    case state.matches("loaded.idle"):
      return "Refresh";
    case state.matches("loaded.refreshing"):
      return "Refreshing";
    default:
      return "¯\\_(ツ)_/¯";
  }
};

const RepoList: FC<{ path: string }> = ({ path }) => {
  const [current, send] = useMachine(repoListMachine, { context: { path } });

  return (
    <>
      <Button onClick={onClick(current, send)}>{buttonLabel(current)}</Button>
      <div>
        <div>state: {JSON.stringify(current.value)}</div>
        {current.context.list?.length ? (
          <Accordion allowMultiple allowToggle>
            {current.context.list?.map(({ name }) => (
              <Repo
                key={name}
                loadAt={current.context.loadAt}
                name={name}
                path={`${path}/${name}`}
              />
            ))}
          </Accordion>
        ) : null}
      </div>
    </>
  );
};

export default RepoList;
