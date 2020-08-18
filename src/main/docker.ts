import nodePath from "path";
import { promises as fs } from "fs";
import yaml from "js-yaml";

import { execCmd } from "./runCmd";

// import { readDir } from "./file";

import {
  ComposeConfig,
  ComposeConfigService,
  DevStack,
  DockerComposeFile,
  DockerComposeFiles,
  DockerComposeService,
  DockerComposeServiceVolume,
  DockerPsContainer,
  ServiceSourceType,
} from "../types";

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

async function readDockerComposeFile(
  path: string
): Promise<DockerComposeFile | void> {
  try {
    const content = await fs.readFile(path, "utf8");
    const data = yaml.safeLoad(content);
    return data as DockerComposeFile;
  } catch (e) {
    console.log(e);
    return;
  }
}

async function readDockerComposeFiles(
  path: string,
  ...files: string[]
): Promise<DockerComposeFiles> {
  const contents = await Promise.all(
    files.map(async (file) => {
      return readDockerComposeFile(nodePath.join(path, file));
    })
  );
  const lu: DockerComposeFiles = {};
  files.forEach((file, idx) => {
    const content = contents[idx];
    if (content) {
      lu[file] = content;
    }
  });
  return lu;
}

// async function readDockerCompose(path: string): Promise<DockerComposeFiles> {
//   const files = await Promise.all(
//     (await readDir(path, { filesOnly: true }))
//       .filter((f) => /^docker-compose\./.test(f.name))
//       .map(async (f) => {
//         return {
//           name: f.name,
//           data: await readDockerComposeFile(`${path}/${f.name}`),
//         };
//       })
//   );
//   const lu: DockerComposeFiles = {};
//   files.forEach((f) => {
//     if (f?.name && f?.data) {
//       lu[f.name] = f.data;
//     }
//   });
//   return lu;
// }

const composeProps: Array<keyof DockerComposeService> = [
  "container_name",
  "image",
  "build",
  "volumes",
];

function createComposeConfig(
  path: string,
  files: DockerComposeFiles
): ComposeConfig {
  const config: ComposeConfig = { version: "", services: {} };

  const { services } = config;

  Object.keys(files).forEach((fileName) => {
    const dcServices = files[fileName].services;
    config.version = files[fileName].version;
    Object.keys(dcServices).forEach((serviceName: string) => {
      if (!services[serviceName]) {
        services[serviceName] = { name: serviceName };
      }
      const dcService = dcServices[serviceName];
      const service = services[serviceName];
      composeProps.forEach((prop) => {
        if (dcService[prop]) {
          if (prop === "build") {
            if (typeof dcService.build === "string") {
              service.build = { context: dcService.build };
            } else {
              service.build = dcService.build;
            }
          } else if (prop === "volumes") {
            if (dcService.volumes) {
              service.volumes = dcService.volumes.map(
                (volume: DockerComposeServiceVolume) => {
                  if (typeof volume === "string") {
                    const parts = volume.split(":");
                    if (parts.length === 1) {
                      const [target] = parts;
                      return { target };
                    }
                    if (parts.length === 2) {
                      const [source, target] = parts;
                      return { source, target };
                    }
                    const [source, target, mode] = parts;
                    return { source, target, read_only: mode === "ro" };
                  } else {
                    return volume;
                  }
                }
              );
            }
          } else {
            service[prop] = dcService[prop];
          }
        }
      });
    });
  });

  Object.keys(services).forEach((key) => {
    const service = services[key];
    const sourceType = getServiceSourceType(service);
    service.sourceType = sourceType;
    service.path = getServicePath(path, sourceType, service);
  });

  return config;
}

function getServicePath(
  path: string,
  sourceType: string,
  service: ComposeConfigService
): string | undefined {
  if (["mount", "build"].includes(sourceType)) {
    let repoPath = "";
    if (service.build?.context) {
      repoPath = nodePath.normalize(nodePath.join(path, service.build.context));
    }
    return repoPath;
  }
}

function getServiceSourceType(
  service: ComposeConfigService
): ServiceSourceType {
  return service.build?.context
    ? service.volumes?.length
      ? "mount"
      : "build"
    : "image";
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
  const composeCfgFiles = await readDockerComposeFiles(
    path,
    "docker-compose.yml",
    "docker-compose.override.yml"
  );
  const composeConfig = createComposeConfig(path, composeCfgFiles);
  const dockerPs = parseContainerList(await listContainers(path), path);

  return {
    path,
    composeConfig,
    dockerPs,
  };
}
