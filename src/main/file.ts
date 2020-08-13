import os from "os";

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

export async function readDir(
  path: PathLike,
  options?: { directoriesOnly?: boolean; filesOnly?: boolean }
): Promise<Dirent[]> {
  const files = await fs.readdir(path, { withFileTypes: true });
  if (options?.directoriesOnly) {
    return files.filter((f) => f.isDirectory());
  }
  if (options?.filesOnly) {
    return files.filter((f) => f.isFile());
  }
  return files;
}

export function writeFile(path: string, content: string): Promise<void> {
  return fs.writeFile(path, content);
}

export async function getAppDirectory(): Promise<string> {
  const dir = `${os.homedir() || os.tmpdir()}/.dev-stack-dashboard`;
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
