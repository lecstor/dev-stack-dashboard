import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import useInterval from "../hooks/useInterval";
import { GitStatus } from "../../types";

import { fetchGitStatus, fetchGitCommitsBehindMaster } from "../ipc";

import {
  setGitRepoCommitsBehindMaster,
  setGitRepoStatus,
} from "../store/gitSlice";
import {
  selectGitCommitsBehindMaster,
  selectGitStatus,
} from "../store/gitSelectors";

import useManageGitFetch from "./useManageGitFetch";

type Return = {
  branch?: string;
  gitCommitsBehindMaster?: number;
  gitStatus?: GitStatus;
  lastFetch?: number;
};

type Options = { name: string; path: string };

const useManageGit = ({ name, path }: Options): Return => {
  const dispatch = useDispatch();
  const gitStatus = useSelector(selectGitStatus(name));
  const gitCommitsBehindMaster = useSelector(
    selectGitCommitsBehindMaster(name)
  );

  const { lastFetch, checkFetch } = useManageGitFetch({ name, path });

  const branch = gitStatus?.current || undefined;

  const fetchStatus = () => {
    fetchGitStatus(path).then((result) => {
      dispatch(setGitRepoStatus(result, name));
    });
  };

  const fetchCommitsBehindMaster = () => {
    branch &&
      fetchGitCommitsBehindMaster(path, branch).then((result) => {
        dispatch(setGitRepoCommitsBehindMaster(result, name));
      });
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
