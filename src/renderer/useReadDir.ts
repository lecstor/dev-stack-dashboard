import { useEffect, useState } from "react";

import { Dirent } from "fs";

import { FilePath } from "../main/file";

import { readDir } from "./ipc";

type Props = {
  path: FilePath;
  directoriesOnly?: boolean;
};

type Return = { files: Dirent[] } | undefined;

const useReadDir = ({ path, directoriesOnly }: Props): Return => {
  const [files, setFiles] = useState<Dirent[]>();

  useEffect(() => {
    readDir(path, { directoriesOnly }).then(setFiles);
  }, []);

  return files ? { files } : undefined;
};

export default useReadDir;
