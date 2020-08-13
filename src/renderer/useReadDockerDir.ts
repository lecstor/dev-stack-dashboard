import { useEffect, useState } from "react";

import { FilePath } from "../main/file";
import { DirMeta } from "../types";

import { readDockerDir } from "./ipc";

type Props = {
  path: FilePath;
  directoriesOnly?: boolean;
};

type Return = { files: DirMeta[] } | undefined;

const useReadDockerDir = ({ path }: Props): Return => {
  const [files, setFiles] = useState<DirMeta[]>();

  useEffect(() => {
    readDockerDir(path).then(setFiles);
  }, []);

  return files ? { files } : undefined;
};

export default useReadDockerDir;
