import { BrowserWindow } from "electron";

const isMac = process.platform === "darwin";

export const menuTemplate = (
  mainWindow: BrowserWindow
): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] => {
  return [
    { role: "appMenu" },
    { role: "fileMenu" },
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
