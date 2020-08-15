import { ipcMain, IpcMainInvokeEvent as IE } from "electron";

import { DevStack } from "../types";

import { fetchStack } from "./docker";
import {
  getCommitsBehindMaster,
  getLastFetchAt,
  getGitFetch,
  getGitStatus,
  GitFetch,
  GitStatus,
} from "./git";
import {
  getSettings,
  setSettingsStackDir,
  setSettingsStackState,
} from "./store";

type Path = string;

function fetchDockerStack(e: IE, path: Path): Promise<DevStack> {
  return fetchStack(path);
}

async function fetchGitStatus(e: IE, path: Path): Promise<GitStatus | void> {
  return getGitStatus(path);
}

async function fetchGitLastFetch(e: IE, path: Path): Promise<Date | void> {
  return getLastFetchAt(path);
}

async function fetchGitFetch(e: IE, path: Path): Promise<GitFetch | void> {
  return getGitFetch(path);
}

async function fetchGitCommitsBehindMaster(
  e: IE,
  path: Path,
  branch: string
): Promise<number | void> {
  return getCommitsBehindMaster(path, branch);
}

export function initHandlers(): void {
  ipcMain.handle("fetch-docker-stack", fetchDockerStack);
  ipcMain.handle("fetch-git-status", fetchGitStatus);
  ipcMain.handle("fetch-git-last-fetch", fetchGitLastFetch);
  ipcMain.handle("fetch-git-fetch", fetchGitFetch);
  ipcMain.handle(
    "fetch-git-commits-behind-master",
    fetchGitCommitsBehindMaster
  );

  ipcMain.handle("get-settings", getSettings);
  ipcMain.handle("set-settings-stack-dir", (event: IE, path: Path) =>
    setSettingsStackDir(path)
  );
  ipcMain.handle("set-settings-stack-state", (event: IE, state: DevStack) =>
    setSettingsStackState(state)
  );
}
