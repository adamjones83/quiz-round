import { app, BrowserWindow, Menu, MenuItemConstructorOptions, MenuItem, ipcMain } from "electron";
import * as url from "url";
import * as path from "path";
import { } from './menu';
import { getMacMenu } from './menu/mac-menu';
import { getWindowsMenu } from './menu/windows-menu';


/* const electron = require('electron');
const url = require('url');
const path = require('path');
*/

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
    },
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );
});

/*
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log('logging IPC message from main', event);
    event.reply('asynchronous-reply', 'holla back async');
});

ipcMain.on('synchronous-message', (event, arg) => {
    console.log('logging IPC message from main', event);
    event.returnValue = 'holla back sync';
});
*/