import { ipcRenderer, contextBridge } from 'electron';
import { MENU_EVENT, MenuEventType } from './ipc-types';
import { ElectronClient } from './app/electron-client';
import { menuEvents } from './menu-handler';

ipcRenderer.on(MENU_EVENT, (_,args) => menuEvents.raiseEvent(args as MenuEventType));

contextBridge.exposeInMainWorld('MENU', {
    addHandler: menuEvents.addHandler
});

const client = ElectronClient();
contextBridge.exposeInMainWorld('client', {
    ...client
});