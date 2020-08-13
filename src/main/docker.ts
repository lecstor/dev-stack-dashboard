import nodePath from "path";
import { promises as fs } from "fs";
import yaml from "js-yaml";

import { execCmd } from "./runCmd";

import { readDir } from "./file";

import { DevStack, DockerComposeFiles, DockerPsContainer } from "../types";

const isObject = (v: unknown) =>
  Object.prototype.toString.call(v) === "[object Object]";

async function hasFile(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch (err) {
    return false;
  }
}

export function getHasDockerfile(path: string): Promise<boolean> {
  return hasFile(`${path}/Dockerfile`);
}

export function getHasDockerCompose(path: string): Promise<boolean> {
  return hasFile(`${path}/docker-compose.yml`);
}

async function listContainers(path: string): Promise<DockerPsContainer[]> {
  const psString = await execCmd("docker-compose ps", { cwd: path });
  const lines = psString.split(/\n/);
  if (lines.length === 2) return [];
  const containerLines = lines.slice(2, lines.length - 2);
  const containers = containerLines.map((line) => {
    const [name, command, state, ports] = line.split(/\s{2,}/);
    return { name, command, state, ports };
  });
  return containers;
}

async function readDockerCompose(path: string): Promise<DockerComposeFiles> {
  const files = await Promise.all(
    (await readDir(path, { filesOnly: true }))
      .filter((f) => /^docker-compose\./.test(f.name))
      .map(async (f) => {
        try {
          const content = await fs.readFile(`${path}/${f.name}`, "utf8");
          const data = yaml.safeLoad(content);
          return { name: f.name, data };
        } catch (e) {
          console.log(e);
          return null;
        }
      })
  );
  const lu: DockerComposeFiles = {};
  files.forEach((f) => {
    if (f?.name && f?.data) {
      lu[f.name] = f.data;
    }
  });
  return lu;
}

function parseComposeFiles(
  files: DockerComposeFiles,
  path: string
): DevStack["composeState"] {
  const services: Record<string, any> = {};

  ["docker-compose.yml", "docker-compose.override.yml"].forEach((file) => {
    const serviceKeys = Object.keys(files[file].services);
    serviceKeys.forEach((key: string) => {
      const { image, build, volumes } = files[file].services[key];
      let buildContext = build;
      if (isObject(build)) {
        buildContext = build.context;
      }

      services[key] = {
        ...services[key],
        buildContext,
        image,
        volumes,
      };
    });
  });

  const serviceKeys = Object.keys(services);

  serviceKeys.forEach((key: string) => {
    const service = services[key];
    services[key].state = service.buildContext
      ? service.volumes
        ? "mount"
        : "build"
      : "image";
  });

  for (const key of serviceKeys) {
    const service = services[key];
    if (["mount", "build"].includes(service.state)) {
      let repoPath = "";
      if (service.buildContext) {
        repoPath = nodePath.normalize(
          nodePath.join(path, service.buildContext)
        );
      }
      if (repoPath) {
        services[key].path = repoPath;
      }
    }
  }

  return services;
}

function parseContainerList(
  containerList: DockerPsContainer[],
  path: string
): Record<string, DockerPsContainer> {
  const { base } = nodePath.parse(path);
  const extractId = new RegExp(`${base}_(.+)_\\d+$`);
  const containers: Record<string, DockerPsContainer> = {};
  containerList.forEach((c) => {
    const match = extractId.exec(c.name);
    if (match) containers[match[1]] = c;
  });
  return containers;
}

export async function fetchStack(path: string): Promise<DevStack> {
  const composeCfgFiles = await readDockerCompose(path);
  const composeState = parseComposeFiles(composeCfgFiles, path);
  const dockerPs = parseContainerList(await listContainers(path), path);
  return {
    path,
    composeState,
    dockerPs,
  };
}
