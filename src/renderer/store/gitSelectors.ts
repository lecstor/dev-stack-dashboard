import { GitStatus } from "../../types";
import { RootState } from "./index";

export function selectGitCommitsBehindMaster(name: string) {
  return ({ git }: RootState): number | undefined => git[name]?.behindMaster;
}

export function selectGitLastFetch(name: string) {
  return ({ git }: RootState): number | undefined => git[name]?.lastFetch;
}

export function selectGitStatus(name: string) {
  return ({ git }: RootState): GitStatus | undefined => git[name]?.status;
}
