import { dialog, BrowserWindow } from "electron";

export async function showOpenDialog(
  window: BrowserWindow
): Promise<Electron.OpenDialogReturnValue> {
  return dialog.showOpenDialog(window, {
    properties: ["openDirectory"],
  });
}
