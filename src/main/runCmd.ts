import {
  exec,
  spawn,
  ExecOptions,
  SpawnOptionsWithoutStdio,
} from "child_process";

/*
    dockerComposePs = await spawnCmd("docker-compose", ["ps"], {
      cwd: path,
    }).catch((error) => error);
*/
export function spawnCmd(
  cmd: string,
  args?: string[],
  options?: SpawnOptionsWithoutStdio | undefined
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const result: string[] = [];
    const error: string[] = [];

    const p = spawn(cmd, args, options);

    p.stdout.on("data", (data) => {
      result.push(data.toString());
    });

    p.stderr.on("data", (data) => {
      error.push(data.toString());
    });

    p.on("close", (code) => {
      if (code) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

/*
    dockerComposePs = await execCmd("docker-compose ps", { cwd: path }).catch(
      (error) => error
    );
*/
export function execCmd(
  cmd: string,
  options: ExecOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      { timeout: 10000, maxBuffer: 20000 * 1024, ...options },
      function (error, stdout, stderr) {
        if (error) {
          (error as any).message = stderr.toString();
          reject(error);
        } else {
          resolve(stdout.toString());
        }
      }
    );
  });
}
