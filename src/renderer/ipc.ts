import { Dirent } from "fs";

import { FilePath } from "../main/file";

import {
  DevStack,
  DirMeta,
  GitStatus,
  RepoDetailMeta,
  RepoMeta,
  Settings,
} from "../types";

import { ipcRenderer } from "electron";

export function fetchStack(path: FilePath): Promise<DevStack> {
  return ipcRenderer.invoke("fetch-docker-stack", path);
}

export function fetchGitStatus(path: FilePath): Promise<GitStatus> {
  return ipcRenderer.invoke("fetch-git-status", path);
}

export function fetchGitLastFetch(path: FilePath): Promise<Date | undefined> {
  return ipcRenderer.invoke("fetch-git-last-fetch", path);
}

export function fetchGitFetch(path: FilePath): Promise<Date | undefined> {
  return ipcRenderer.invoke("fetch-git-fetch", path);
}

export function fetchGitCommitsBehindMaster(
  path: FilePath,
  branch: string
): Promise<number | undefined> {
  return ipcRenderer.invoke("fetch-git-commits-behind-master", path, branch);
}

export function readDir(
  path: FilePath,
  options?: { directoriesOnly?: boolean }
): Promise<Dirent[]> {
  return ipcRenderer.invoke("read-dir", path, options);
}

export function readDockerDir(path: FilePath): Promise<DirMeta[]> {
  return ipcRenderer.invoke("read-docker-dir", path);
}

export function readRepoList(path: FilePath): Promise<RepoMeta[]> {
  return ipcRenderer.invoke("read-repo-list", path);
}

export function readRepo(path: FilePath): Promise<RepoDetailMeta> {
  return ipcRenderer.invoke("read-repo", path);
}

export function onDirectoryOpen(
  listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
): () => void {
  ipcRenderer.on("directory-opened", listener);
  return () => ipcRenderer.off("directory-opened", listener);
}

export function getSettings(): Promise<Settings> {
  return ipcRenderer.invoke("get-settings");
}

export function setSettingsStackDir(path: string): Promise<Settings> {
  return ipcRenderer.invoke("set-settings-stack-dir", path);
}

export function setSettingsStackState(state: DevStack): Promise<Settings> {
  return ipcRenderer.invoke("set-settings-stack-state", state);
}
