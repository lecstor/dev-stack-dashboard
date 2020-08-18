import { ComposeConfigService } from "../../types";
import { RootState } from "./index";

export function selectServicesBySourceTypes(types: string[]) {
  return ({ config }: RootState): ComposeConfigService[] | undefined => {
    if (!config.compose) return;
    return Object.values(config.compose.services)
      .filter(({ sourceType }) => {
        if (!sourceType) {
          return types.length === 0;
        }
        return types.includes(sourceType);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };
}
