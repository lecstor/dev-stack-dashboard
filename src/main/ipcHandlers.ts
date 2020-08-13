import {
  ipcMain,
  BrowserWindow,
  IpcMainInvokeEvent as InvokeEvent,
} from "electron";

import { DevStack } from "../types";

import {
  fetchStack,
  getHasDockerCompose,
  getHasDockerfile,
  listContainers,
  parseComposeFiles,
  readDockerCompose,
} from "./docker";
import { readDir, PathLike } from "./file";
import {
  getCommitsBehindMaster,
  getIsGitRepo,
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

async function readDirWrapper(
  _event: InvokeEvent,
  path: PathLike,
  options: { directoriesOnly: boolean }
) {
  return readDir(path, options);
}

async function readDockerComposeStructure(_event: InvokeEvent, path: string) {
  const dirs = await readDir(path, { directoriesOnly: true });
  const dirsMeta = await Promise.all(
    dirs.map(async (dir) => {
      const fullPath = `${path}/${dir.name}`;

      const dockerfile = await getHasDockerfile(fullPath);
      const dockerCompose = await getHasDockerCompose(fullPath);
      let files;
      if (dockerCompose) {
        files = await readDockerCompose(`${fullPath}`);
      }

      const gitStatus = await getGitStatus(path);

      return {
        name: dir.name,
        dockerfile,
        dockerCompose,
        gitStatus,
        files,
      };
    })
  );
  const filtered = dirsMeta.filter((m) => m.dockerCompose && m.dockerfile);
  return filtered;
}

async function readRepoList(_event: InvokeEvent, path: string) {
  const dirs = await readDir(path, { directoriesOnly: true });
  const dirsMeta = await Promise.all(
    dirs.map(async (dir) => {
      const fullPath = `${path}/${dir.name}`;

      const hasDockerfile = await getHasDockerfile(fullPath);
      const hasDockerCompose = await getHasDockerCompose(fullPath);
      const isGitRepo = await getIsGitRepo(path);
      return {
        name: dir.name,
        hasDockerfile,
        hasDockerCompose,
        isGitRepo,
      };
    })
  );
  const filtered = dirsMeta.filter(
    (m) => m.isGitRepo && (m.hasDockerCompose || m.hasDockerfile)
  );
  return filtered;
}

async function readRepo(_event: InvokeEvent, path: string) {
  const dockerfile = await getHasDockerfile(path);
  const dockerCompose = await getHasDockerCompose(path);
  let files;
  let dockerComposePs;
  if (dockerCompose) {
    files = await readDockerCompose(`${path}`);
    dockerComposePs = await listContainers(path);
  }

  const gitStatus = await getGitStatus(path);
  let lastFetchAt;
  let commitsBehindMaster;
  if (gitStatus) {
    try {
      commitsBehindMaster = gitStatus?.current
        ? getCommitsBehindMaster(path, gitStatus.current)
        : undefined;
      lastFetchAt = getLastFetchAt(path);
    } catch (err) {
      console.log(err);
    }
  }
  return {
    path,
    dockerfile,
    dockerCompose,
    dockerComposePs,
    gitStatus,
    lastFetchAt,
    files,
    commitsBehindMaster,
  };
}

function fetchDockerStack(
  _event: InvokeEvent,
  path: string
): Promise<DevStack> {
  return fetchStack(path);
}

async function fetchGitStatus(
  _event: InvokeEvent,
  path: string
): Promise<GitStatus | undefined> {
  return getGitStatus(path);
}

async function fetchGitLastFetch(
  _event: InvokeEvent,
  path: string
): Promise<Date | undefined> {
  return getLastFetchAt(path);
}

async function fetchGitFetch(
  _event: InvokeEvent,
  path: string
): Promise<GitFetch | undefined> {
  return getGitFetch(path);
}

async function fetchGitCommitsBehindMaster(
  _event: InvokeEvent,
  path: string,
  branch: string
): Promise<number | undefined> {
  return getCommitsBehindMaster(path, branch);
}

export function initHandlers(window: BrowserWindow): void {
  ipcMain.handle("fetch-docker-stack", fetchDockerStack);
  ipcMain.handle("fetch-git-status", fetchGitStatus);
  ipcMain.handle("fetch-git-last-fetch", fetchGitLastFetch);
  ipcMain.handle("fetch-git-fetch", fetchGitFetch);
  ipcMain.handle(
    "fetch-git-commits-behind-master",
    fetchGitCommitsBehindMaster
  );

  ipcMain.handle("get-settings", getSettings);
  ipcMain.handle("set-settings-stack-dir", (event: InvokeEvent, path: string) =>
    setSettingsStackDir(path)
  );
  ipcMain.handle(
    "set-settings-stack-state",
    (event: InvokeEvent, state: DevStack) => setSettingsStackState(state)
  );

  ipcMain.handle("read-dir", readDirWrapper);
  ipcMain.handle("read-docker-dir", readDockerComposeStructure);
  ipcMain.handle("read-repo-list", readRepoList);
  ipcMain.handle("read-repo", readRepo);
}
