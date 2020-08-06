import {
  ipcMain,
  BrowserWindow,
  IpcMainInvokeEvent as InvokeEvent,
} from "electron";
import { promises as fs } from "fs";
import yaml from "js-yaml";
import simpleGit, { SimpleGit, StatusResult } from "simple-git";

import { readDir, PathLike } from "./file";

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

type FilesMeta = Array<DockerComposeMeta | ErrorMeta>;

async function readDockerCompose(path: string): Promise<FilesMeta> {
  return Promise.all(
    (await readDir(path, { filesOnly: true }))
      .filter((f) => /^docker-compose\./.test(f.name))
      .map(async (f) => {
        const content = await fs.readFile(`${path}/${f.name}`, "utf8");
        console.log("safeLoad", `${path}/${f.name}`);
        try {
          const data = yaml.safeLoad(content);
          console.log(data);
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

function hasDockerfile(path: string) {
  return hasFile(`${path}/Dockerfile`);
}

function hasDockerCompose(path: string) {
  return hasFile(`${path}/docker-compose.yml`);
}

export type DirMeta = {
  name: string;
  dockerfile: boolean;
  dockerCompose: boolean;
  gitStatus: StatusResult;
  files: FilesMeta;
};

async function readDockerComposeStructure(_event: InvokeEvent, path: PathLike) {
  console.log("readDirWrapper", path);
  const dirs = await readDir(path, { directoriesOnly: true });
  console.log({ dirs });
  const dirsMeta = await Promise.all(
    dirs.map(async (dir) => {
      const fullPath = `${path}/${dir.name}`;
      console.log({ fullPath });

      const dockerfile = await hasDockerfile(fullPath);
      const dockerCompose = await hasDockerCompose(fullPath);
      let files;
      if (dockerCompose) {
        files = await readDockerCompose(`${fullPath}`);
      }

      const git: SimpleGit = simpleGit(fullPath);

      const isRepo = await git.checkIsRepo();
      const gitStatus = isRepo ? await git.status() : undefined;
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

export function initHandlers(window: BrowserWindow): void {
  ipcMain.handle("read-dir", readDirWrapper);
  ipcMain.handle("read-docker-dir", readDockerComposeStructure);
}
