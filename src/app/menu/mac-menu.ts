import { MenuItemConstructorOptions, MenuItem } from 'electron';
import { MenuEventType } from '../../ipc-types';
import { menuEvents } from '../../ipc-events';

export function getMacMenu(): (MenuItemConstructorOptions | MenuItem)[] {
    return [getAppMenu(), getQuizMenu(), getDebugMenu()];
}

function appSubmenu(label:string, menuEvent:MenuEventType) {
    return { label, click: () => menuEvents.raiseEvent(menuEvent) };
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
            appSubmenu('Edit Lineups', 'pick-lineups'),
            appSubmenu('Show Scores', 'show-scores'),
            appSubmenu('Set Question #', 'set-question'),
            { type: 'separator' },
            appSubmenu('Timeout', 'timeout'),
            appSubmenu('Foul', 'foul'),
            { type: 'separator' },
            appSubmenu('Challenge', 'challenge'),
            appSubmenu('Appeal', 'appeal'),
            
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