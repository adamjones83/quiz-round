import { app, BrowserWindow, Menu, MenuItemConstructorOptions, MenuItem, ipcMain } from "electron";
import * as url from "url";
import * as path from "path";
import { getMacMenu } from './app/menu/mac-menu';
import { getWindowsMenu } from './app/menu/windows-menu';
import { QuizRoundClient } from "./app/database/lib/data-layer";
import { MENU_EVENT, DATA_REQUEST, DataRequestType } from './ipc-types';
import { menuEvents } from "./app/menu/menu-handler";

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
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // contextIsolation: true
        }
    });

    // set up the menu event emitter
    menuEvents.addHandler(evt => {
        console.log('MENU_EVENT: ' + evt.name);
        mainWindow.webContents.send(MENU_EVENT, evt.name);
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: "file:",
        slashes: true,
    }));
});

// set up electron quiz client IPC
const client = QuizRoundClient('sample.db')
ipcMain.on(DATA_REQUEST, async (evt,name:DataRequestType) => {
    const responseChannel = `${DATA_REQUEST}:${name}`;
    console.log(`DATA REQUEST: '${name}'`);
    switch(name) {
        case 'get-quizzers':
            evt.reply(responseChannel, await client.getQuizzers());
            break;
        case 'get-teams':
            evt.reply(responseChannel, await client.getTeams());
            break;
        case 'get-lineups':
            evt.reply(responseChannel, await client.getLineups());
            break;
        default: break;
    }
})