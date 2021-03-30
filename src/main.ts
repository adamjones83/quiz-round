import { app, BrowserWindow, Menu, MenuItemConstructorOptions, MenuItem, ipcMain } from "electron";
import * as url from "url";
import * as path from "path";
import { getMacMenu } from './app/menu/mac-menu';
import { getWindowsMenu } from './app/menu/windows-menu';
import { MENU_EVENT } from './ipc-types';
import { menuEvents } from "./menu-handler";
import './app/database/database-ipc-handler';

const isMac = process.platform === 'darwin';
app.name = "Quiz-Round";
app.disableHardwareAcceleration();
// set up the menu - NOTE: this replaces the default menu and dev tools are no longer available, look into adding them

const template: (MenuItemConstructorOptions | MenuItem)[] = isMac ? getMacMenu() : getWindowsMenu();
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// create the main window
app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true
        }
    });

    // emit menu events to ipcRenderer
    menuEvents.addHandler(menuEventType => mainWindow.webContents.send(MENU_EVENT, menuEventType));

    const mainWindowUrl = new URL(path.join(__dirname, 'mainWindow.html'), 'file://').toString();
    mainWindow.loadURL(mainWindowUrl);
});
