import { MenuItemConstructorOptions, MenuItem } from 'electron';
import { MenuEventType } from '../../ipc-types';
import { menuEvents } from '../../ipc-events';

export function getMacMenu(): (MenuItemConstructorOptions | MenuItem)[] {
    return [getAppMenu(), getQuizMenu(), getActionsMenu(), getDataMenu(), getDebugMenu()];
}

function appSubmenu(label: string, menuEvent: MenuEventType) {
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
            appSubmenu('Start New Round', 'restart-round'),
            { type: 'separator' },
            appSubmenu('Set Round Title', 'set-round-title'),
            appSubmenu('Set Question #', 'set-question'),
            { type: 'separator' },
            appSubmenu('Edit Lineups', 'pick-lineups'),
            appSubmenu('Show Scores', 'show-scores'),
            {   
                label: 'Bonus Handling',
                toolTip: 'handling of bonus points such as 3rd person bonus',
                submenu: [
                    {
                        label: 'automatic',
                        type: 'radio',
                        checked: true,
                        click: () => menuEvents.raiseEvent('bonus-handling-auto')
                    },
                    {
                        label: 'manual',
                        type: 'radio',
                        click: () => menuEvents.raiseEvent('bonus-handling-manual')
                    }
                ]
            },
            {
                label: 'Sound',
                submenu: [
                    {
                        label: 'enabled',
                        type: 'radio',
                        click: () => menuEvents.raiseEvent('sound-enabled'),
                        checked: true
                    },
                    {
                        label: 'disabled',
                        type: 'radio',
                        click: () => menuEvents.raiseEvent('sound-disabled')
                    }
                ]
            }
        ]
    }
}
function getActionsMenu(): (MenuItemConstructorOptions | MenuItem) {
    return {
        label: 'Actions',
        submenu: [
            appSubmenu('Timeout', 'timeout'),
            appSubmenu('Foul', 'foul'),
            { type: 'separator' },
            appSubmenu('Challenge', 'challenge'),
            appSubmenu('Appeal', 'appeal'),
        ]
    }
}
function getDataMenu(): (MenuItemConstructorOptions | MenuItem) {
    return {
        label: 'Data',
        submenu: [
            appSubmenu('Edit Quizzers', 'edit-quizzers'),
            appSubmenu('Edit Teams', 'edit-teams'),
            appSubmenu('Edit Meets', 'edit-meets'),
            appSubmenu('Edit Sounds', 'edit-sounds')
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