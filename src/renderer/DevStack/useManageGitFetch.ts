import { useEffect, useState } from "react";
import subMinutes from "date-fns/subMinutes";

import { fetchGitFetch, fetchGitLastFetch } from "../ipc";

type Return = {
  lastFetch?: Date;
  fetchRepo: () => Promise<void>;
  checkFetch: () => Promise<void>;
};

type Options = { path?: string; expire?: number };

const useManageGitFetch = ({ path, expire = 15 }: Options): Return => {
  const [lastFetch, setLastFetch] = useState<Date | undefined>();

  const fetchRepo = () => {
    if (path) {
      return fetchGitFetch(path).then(() =>
        fetchGitLastFetch(path).then((newLastAt) => setLastFetch(newLastAt))
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
          } else if (lastAt.toString() !== lastFetch?.toString()) {
            setLastFetch(lastAt);
          }
        }
      });
    }
    return Promise.resolve();
  };

  useEffect(() => {
    fetchRepo();
  }, []);

  return { lastFetch, checkFetch, fetchRepo };
};

export default useManageGitFetch;
