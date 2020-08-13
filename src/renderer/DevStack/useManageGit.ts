import { useEffect, useState } from "react";

import useInterval from "../hooks/useInterval";
import { GitStatus } from "../../types";

import { fetchGitStatus, fetchGitCommitsBehindMaster } from "../ipc";

import useManageGitFetch from "./useManageGitFetch";

type Return = {
  branch?: string;
  gitCommitsBehindMaster?: number;
  gitStatus?: GitStatus;
  lastFetch?: Date;
};

type Options = { path: string };

const useManageGit = ({ path }: Options): Return => {
  const [gitStatus, setGitStatus] = useState<GitStatus | undefined>();
  const [gitCommitsBehindMaster, setGitCommitsBehindMaster] = useState<
    number | undefined
  >();
  const { lastFetch, checkFetch } = useManageGitFetch({ path });

  const branch = gitStatus?.current || undefined;

  const fetchStatus = () => {
    fetchGitStatus(path).then((result) => setGitStatus(result));
  };

  const fetchCommitsBehindMaster = () => {
    branch &&
      fetchGitCommitsBehindMaster(path, branch).then((result) =>
        setGitCommitsBehindMaster(result)
      );
  };

  useInterval(checkFetch, 30000);
  useInterval(fetchStatus, 30000);

  useEffect(() => {
    checkFetch()
      .then(() => fetchStatus())
      .then(() => fetchCommitsBehindMaster());
  }, [path, lastFetch]);

  return {
    branch,
    gitStatus,
    gitCommitsBehindMaster,
    lastFetch,
  };
};

export default useManageGit;
