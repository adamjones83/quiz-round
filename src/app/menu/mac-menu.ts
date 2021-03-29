import { MenuItemConstructorOptions, MenuItem } from 'electron';
import { menuEvents } from './menu-handler';

export function getMacMenu(): (MenuItemConstructorOptions | MenuItem)[] {
    return [getAppMenu(), getQuizMenu(), getDebugMenu()];
}

function getAppMenu(): (MenuItemConstructorOptions | MenuItem) {
    return {
        label: "File",
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      }
}
function getQuizMenu(): (MenuItemConstructorOptions | MenuItem) {
    return {
        label: "Quiz",
        submenu: [
            { 
                label: 'Edit Lineups',
                click: () => menuEvents.raiseEvent({name:'edit-lineups'})
            }
        ]
    }
}
function getDebugMenu(): (MenuItemConstructorOptions | MenuItem) {
    return {
        label: 'Debug',
        submenu: [
            { role: 'forceReload' },
            { role: 'toggleDevTools' }
        ]
    }
}