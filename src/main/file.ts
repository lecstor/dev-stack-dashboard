import homeOrTmp from "home-or-tmp";

import { promises as fs, PathLike, Dirent } from "fs";

export { PathLike, Dirent };

export type FilePath = string;
export type FileContent = string;

export type File = {
  path: FilePath;
  content: FileContent;
};

export function readFile(path: string): Promise<string> {
  return fs.readFile(path, { encoding: "utf8" });
}

// type ReadDirOptions = {
//   encoding?: string;
//   withFileTypes?: boolean;
// };

// export const readDir = fs.readdir;

export async function readDir(
  path: PathLike,
  options?: { directoriesOnly?: boolean; filesOnly?: boolean }
): Promise<Dirent[]> {
  console.log("readDirWrapper", path, options);
  const files = await fs.readdir(path, { withFileTypes: true });
  if (options?.directoriesOnly) {
    return files.filter((f) => f.isDirectory());
  }
  if (options?.filesOnly) {
    return files.filter((f) => f.isFile());
  }
  return files;
}

// export function readDir(
//   path: string,
//   options: BaseEncodingOptions & { withFileTypes: true } = { encoding: "utf8" }
// ): Promise<string[]> {
//   return fs.readdir(path, {
//     encoding: "utf8",
//   });
// }

export function writeFile(file: File): Promise<void> {
  const { path, content } = file;
  return fs.writeFile(path, content);
}

export async function getAppDirectory(): Promise<string> {
  const dir = `${homeOrTmp}/.docker-dev-ui`;
  try {
    await fs.mkdir(dir);
  } catch (error) {
    if (error.code === "EEXIST") {
      return dir;
    }
    throw error;
  }
  return dir;
}

export function generateTmpFileName(): string {
  return `tmp-${new Date()
    .toISOString()
    .replace(/\..*$/, "")
    .replace(/[^\d]*/g, "")}`;
}
