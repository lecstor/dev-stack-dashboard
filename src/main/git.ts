import { promises as fs } from "fs";
import simpleGit, { SimpleGit, FetchResult, StatusResult } from "simple-git";
import { ComposeState } from "../types";

export type GitStatus = StatusResult;
export type GitFetch = FetchResult;

export async function getIsGitRepo(path: string): Promise<boolean> {
  const git: SimpleGit = simpleGit(path);
  return git.checkIsRepo();
}

export async function getGitStatus(
  path: string
): Promise<StatusResult | undefined> {
  const git: SimpleGit = simpleGit(path);

  const isGitRepo = await git.checkIsRepo();

  if (!isGitRepo) return;

  return git.status();
}

export async function getGitFetch(
  path: string
): Promise<FetchResult | undefined> {
  const git: SimpleGit = simpleGit(path);
  const isGitRepo = await git.checkIsRepo();
  if (!isGitRepo) return;
  return git.fetch();
}

export async function getLastFetchAt(path: string): Promise<Date> {
  const fetchHeadStat = await fs.stat(`${path}/.git/FETCH_HEAD`);
  return new Date(fetchHeadStat.ctime);
}

export async function getCommitsBehindMaster(
  path: string,
  branch: string
): Promise<number> {
  const git: SimpleGit = simpleGit(path);
  const commitsBehindMaster = branch
    ? await git.raw(["cherry", branch, "origin/master"])
    : undefined;
  return (commitsBehindMaster?.split("\n").length || 1) - 1;
}

export async function getServicesBranches(
  path: string,
  composeState: ComposeState
): Promise<Record<string, string>> {
  const serviceKeys = Object.keys(composeState);
  const branches: Record<string, string> = {};
  for (const key of serviceKeys) {
    const service = composeState[key];
    if (["mount", "build"].includes(service.state)) {
      if (service.context) {
        const status = await getGitStatus(`${path}/${service.context}`);
        if (status?.current) {
          branches[key] = status?.current;
        }
      }
    }
  }
  return branches;
}
