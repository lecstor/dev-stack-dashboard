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

export type ServiceComposeState = {
  context: string;
  image?: string;
  state: string;
};

export type ComposeState = Record<string, Record<string, any>>;

export type DevStack = {
  path: string;
  composeState: ComposeState;
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

export type DockerComposeFiles = Record<string, any>;

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
  stack: Pick<DevStack, "path" | "composeState">;
};
