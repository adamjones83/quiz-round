import { ipcRenderer, contextBridge } from 'electron';
import { MENU_EVENT, MenuEventType, SEAT_STATUS_EVENT, SeatStatus } from './ipc-types';
import { ElectronClient } from './app/electron-client';
import { menuEvents, seatEvents } from './ipc-events';

ipcRenderer.on(MENU_EVENT, (_,args) => menuEvents.raiseEvent(args as MenuEventType));
ipcRenderer.on(SEAT_STATUS_EVENT, (_,args) => seatEvents.raiseEvent(args as SeatStatus[]));

contextBridge.exposeInMainWorld('MENU', {
    addHandler: menuEvents.addHandler
});
contextBridge.exposeInMainWorld('SEATS', {
    addHandler: seatEvents.addHandler
})

const client = ElectronClient();
contextBridge.exposeInMainWorld('client', {
    ...client
});