import { promises as fs } from "fs";
import simpleGit, { SimpleGit, StatusResult } from "simple-git";

export { StatusResult };

export async function getIsGitRepo(path: string): Promise<boolean> {
  const git: SimpleGit = simpleGit(path);
  return git.checkIsRepo();
}

export async function status(path: string): Promise<StatusResult | undefined> {
  const git: SimpleGit = simpleGit(path);

  const isGitRepo = await git.checkIsRepo();

  if (!isGitRepo) return;

  return git.status();
}

export async function getLastFetchAt(path: string): Promise<Date> {
  const fetchHeadStat = await fs.stat(`${path}/.git/FETCH_HEAD`);
  console.log("read repo fetchHeadStat.ctime", path, fetchHeadStat.ctime);
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
