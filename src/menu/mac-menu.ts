import { MenuItemConstructorOptions, MenuItem } from 'electron';

export function getMacMenu(): (MenuItemConstructorOptions | MenuItem)[] {
    return [getAppMenu()];
}

function getAppMenu(): (MenuItemConstructorOptions | MenuItem) {
    return {
        label: "File",
        submenu: [
          { role: "about" },
          { type: "separator" },
          { role: "services" },
          { type: "separator" },
          { role: "hide" },
          { role: "hideOthers" },
          { role: "unhide" },
          { type: "separator" },
          { role: "quit" },
        ],
      }
}