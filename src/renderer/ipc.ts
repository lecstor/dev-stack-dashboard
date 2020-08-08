// import { IpcRendererEvent } from "electron";
import { Dirent } from "fs";

import { FilePath } from "../main/file";

import { DirMeta, RepoDetailMeta, RepoMeta } from "../main/ipcHandlers";

const { ipcRenderer } = window.require("electron");

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

// export function ipcOn(
//   channel: string,
//   listener: (event: IpcRendererEvent, ...args: any[]) => void
// ): () => void {
//   ipcRenderer.on(channel, listener);
//   return () => ipcRenderer.off(channel, listener);
// }

// type File = {
//   path: string;
//   content: string;
// };

// export function onOpenFile(listener: (file: File) => void): () => void {
//   return ipcOn("open-file", (_event: IpcRendererEvent, file: File) =>
//     listener(file)
//   );
// }

// export function onSaveFile(listener: (file: File) => void): () => void {
//   return ipcOn("save-file", (_event: IpcRendererEvent, file: File) =>
//     listener(file)
//   );
// }

// export function onNewFile(listener: (file: File) => void): () => void {
//   return ipcOn("new-file", (_event: IpcRendererEvent, file: File) =>
//     listener(file)
//   );
// }
