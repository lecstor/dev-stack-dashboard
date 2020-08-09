import {
  ipcMain,
  BrowserWindow,
  IpcMainInvokeEvent as InvokeEvent,
} from "electron";
import { promises as fs } from "fs";
import yaml from "js-yaml";

import { listContainers } from "./docker";
import { readDir, PathLike } from "./file";
import {
  getCommitsBehindMaster,
  getIsGitRepo,
  getLastFetchAt,
  status as getRepoStatus,
  StatusResult,
} from "./git";

async function readDirWrapper(
  _event: InvokeEvent,
  path: PathLike,
  options: { directoriesOnly: boolean }
) {
  return readDir(path, options);
}

type DockerComposeMeta = {
  name: string;
  data: Record<string, any>;
};

type ErrorMeta = {
  name: string;
  error: string;
};

export type FilesMeta = Array<DockerComposeMeta | ErrorMeta>;

async function readDockerCompose(path: string): Promise<FilesMeta> {
  return Promise.all(
    (await readDir(path, { filesOnly: true }))
      .filter((f) => /^docker-compose\./.test(f.name))
      .map(async (f) => {
        try {
          const content = await fs.readFile(`${path}/${f.name}`, "utf8");
          const data = yaml.safeLoad(content);
          return { name: f.name, data } as DockerComposeMeta;
        } catch (e) {
          return { name: f.name, error: e.message } as ErrorMeta;
        }
      })
  );
}

async function hasFile(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch (err) {
    return false;
  }
}

function getHasDockerfile(path: PathLike) {
  return hasFile(`${path}/Dockerfile`);
}

function getHasDockerCompose(path: PathLike) {
  return hasFile(`${path}/docker-compose.yml`);
}

export type DirMeta = {
  name: string;
  dockerfile: boolean;
  dockerCompose: boolean;
  gitStatus?: StatusResult;
  files?: FilesMeta;
};

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

      const gitStatus = await getRepoStatus(path);

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
  // console.log(JSON.stringify({ filtered }, null, 2));
  // console.log(filtered);
  return filtered;
}

export type RepoMeta = {
  name: string;
  hasDockerfile: boolean;
  hasDockerCompose: boolean;
  isGitRepo: boolean;
};

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
  // console.log(JSON.stringify({ filtered }, null, 2));
  // console.log(filtered);
  return filtered;
}

export type RepoDetailMeta = {
  name: string;
  dockerfile: boolean;
  dockerCompose: boolean;
  dockerComposePs: string;
  gitStatus?: StatusResult;
  lastFetchAt?: Date;
  files?: FilesMeta;
  commitsBehindMaster?: number;
};

async function readRepo(_event: InvokeEvent, path: string) {
  console.log("readRepo", path);
  const dockerfile = await getHasDockerfile(path);
  const dockerCompose = await getHasDockerCompose(path);
  let files;
  let dockerComposePs;
  if (dockerCompose) {
    files = await readDockerCompose(`${path}`);
    dockerComposePs = await listContainers(path);
    console.log(path, { dockerComposePs });
  }

  const gitStatus = await getRepoStatus(path);
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
  console.log("read repo", path, lastFetchAt);
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

export function initHandlers(window: BrowserWindow): void {
  ipcMain.handle("read-dir", readDirWrapper);
  ipcMain.handle("read-docker-dir", readDockerComposeStructure);
  ipcMain.handle("read-repo-list", readRepoList);
  ipcMain.handle("read-repo", readRepo);
}
