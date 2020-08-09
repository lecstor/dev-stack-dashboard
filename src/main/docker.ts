import { execCmd } from "./runCmd";

export async function listContainers(path: string): Promise<string> {
  const psString = await execCmd("docker-compose ps", { cwd: path }).catch(
    (error) => error
  );
  return psString;
}
