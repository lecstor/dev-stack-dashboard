/** Simple Git ************************/
export interface StatusResultRenamed {
  from: string;
  to: string;
}

export interface FileStatusResult {
  from?: string;
  path: string;
  index: string;
  working_dir: string;
}

export interface GitStatus {
  not_added: string[];
  conflicted: string[];
  created: string[];
  deleted: string[];
  modified: string[];
  renamed: StatusResultRenamed[];
  staged: string[];
  files: FileStatusResult[];
  ahead: number;
  behind: number;
  current: string | null;
  tracking: string | null;
}
/***********************************/

export type ServiceSourceType = "build" | "image" | "mount";

export type ComposeService = {
  state: ServiceSourceType;
  path?: string;
  build?: {
    context?: string;
    dockerfile?: string;
  };
  image?: string;
  volumes?: Array<{
    type?: string;
    source?: string;
    target?: string;
    volume?: {
      nocopy: boolean;
    };
    read_only?: boolean;
  }>;
  container_name?: string;
};

export type ComposeConfig = {
  services: {
    [serviceName: string]: ComposeService;
  };
};

export type DevStack = {
  path: string;
  composeConfig: ComposeConfig;
  dockerPs?: Record<string, DockerPsContainer>;
};

export type DirMeta = {
  name: string;
  dockerfile: boolean;
  dockerCompose: boolean;
  gitStatus?: GitStatus;
  files?: DockerComposeFiles;
};

export type DockerPsContainer = {
  name: string;
  command: string;
  state: string;
  ports: string;
};

export type DockerComposeVolume =
  | string
  | {
      type?: string;
      source?: string;
      target?: string;
      volume?: {
        nocopy: boolean;
      };
    };

export type DockerComposeService = {
  image: string;
  build?:
    | string
    | {
        context: string;
        dockerfile?: string;
        args?: Record<string, string> | string[];
        cache_from?: string[];
        labels?: Record<string, string> | string[];
        network?: string;
        shm_size?: string;
        target: string;
      };
  volumes?: DockerComposeVolume[];
  container_name?: string;
};

export type DockerComposeFile = {
  version: string;
  services: Record<string, DockerComposeService>;
  networks: Record<string, any>;
  volumes?: Record<string, any>;
  configs?: Record<string, Record<string, string | boolean>>;
};

export type DockerComposeFiles = Record<string, DockerComposeFile>;

export type RepoDetailMeta = {
  name: string;
  dockerfile: boolean;
  dockerCompose: boolean;
  dockerComposePs: string;
  gitStatus?: GitStatus;
  lastFetchAt?: Date;
  files?: DockerComposeFiles;
  commitsBehindMaster?: number;
};

export type RepoMeta = {
  name: string;
  hasDockerfile: boolean;
  hasDockerCompose: boolean;
  isGitRepo: boolean;
};

export type Settings = {
  stack: Pick<DevStack, "path" | "composeConfig">;
};
