import electron from "electron";
import { readFile, writeFile } from "./file";
import { DevStack, Settings } from "../types";

function getSettingsFilePath() {
  const dir = electron.app.getPath("userData");
  return `${dir}/settings.json`;
}

export async function getSettings(): Promise<Settings> {
  const path = getSettingsFilePath();
  let settings = "{}";
  try {
    settings = await readFile(path);
  } catch (err) {
    console.log(err);
  }
  return JSON.parse(settings);
}

export async function setSettingsStackDir(path: string): Promise<void> {
  const settingsPath = getSettingsFilePath();
  const settings = await getSettings();
  return writeFile(
    settingsPath,
    JSON.stringify({ ...settings, stack: { path } })
  );
}

export async function setSettingsStackState(
  stackState: DevStack
): Promise<void> {
  const settingsPath = getSettingsFilePath();
  const settings = await getSettings();
  const { path, composeState } = stackState;
  return writeFile(
    settingsPath,
    JSON.stringify({ ...settings, stack: { path, composeState } }, null, 2)
  );
}
