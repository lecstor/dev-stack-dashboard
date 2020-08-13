import { BrowserWindow } from "electron";
import { showOpenDialog } from "./dialog";

const isMac = process.platform === "darwin";

export const menuTemplate = (
  mainWindow: BrowserWindow
): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] => {
  return [
    { role: "appMenu" },
    {
      role: "fileMenu",
      submenu: [
        {
          label: "Open Directory",
          accelerator: "CmdOrCtrl+O",
          async click() {
            const result = await showOpenDialog(mainWindow);
            if (result.canceled) return;
            const { filePaths } = result;
            mainWindow.webContents.send("directory-opened", filePaths[0]);
          },
        },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        {
          label: "Toggle Developer Tools",
          click() {
            mainWindow.webContents.toggleDevTools();
          },
          // https://www.electronjs.org/docs/api/accelerator#accelerator
          accelerator: isMac ? "Alt+Command+I" : "Ctrl+Shift+I",
        },
      ],
    },
  ];
};
