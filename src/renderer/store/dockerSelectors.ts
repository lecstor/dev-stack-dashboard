import { DockerPs } from "../../types";
import { RootState } from "./index";

export function selectDockerPs({ docker }: RootState): DockerPs | undefined {
  return docker.ps;
}
