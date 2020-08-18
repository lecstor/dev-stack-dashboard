import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import subMinutes from "date-fns/subMinutes";

import { fetchGitFetch, fetchGitLastFetch } from "../ipc";

import { setGitRepoLastFetch } from "../store/gitSlice";
import { selectGitLastFetch } from "../store/gitSelectors";

type Return = {
  lastFetch?: number;
  fetchRepo: () => Promise<void>;
  checkFetch: () => Promise<void>;
};

type Options = { name: string; path?: string; expire?: number };

const useManageGitFetch = ({ name, path, expire = 15 }: Options): Return => {
  const dispatch = useDispatch();
  const lastFetch = useSelector(selectGitLastFetch(name));

  const fetchRepo = () => {
    if (path) {
      return fetchGitFetch(path).then(() =>
        fetchGitLastFetch(path).then((newLastAt) => {
          dispatch(setGitRepoLastFetch(newLastAt?.getTime(), name));
        })
      );
    }
    return Promise.resolve();
  };

  const checkFetch = () => {
    if (path) {
      return fetchGitLastFetch(path).then((lastAt) => {
        if (lastAt) {
          if (lastAt < subMinutes(new Date(), expire)) {
            return fetchRepo();
          } else if (lastAt.getTime() !== lastFetch) {
            dispatch(setGitRepoLastFetch(lastAt.getTime(), name));
          }
        }
      });
    }
    return Promise.resolve();
  };

  useEffect(() => {
    fetchRepo();
  }, []);

  return {
    lastFetch,
    checkFetch,
    fetchRepo,
  };
};

export default useManageGitFetch;
