# Notes
- files can be fetched via relative URL from the target folder, probably since the html file is launched from there
- preload.js can add functions to the window that expose functionality provided by NodeJS - eg. filesystem access
- main.js is only being used to kick off the app, but it *could* be used as a main process with IPC from the browser code
- CMD+ALT+I is dev tools, CMD+R is reload browser page (for window)
- using typescript to compile main.ts & preload.ts, but react app is getting bundled with webpack
- sounds like the ICON will need to be set with electron-packager as a command args flag
- it seems like ipcMain and ipcRenderer are intended to allow the main & preload scripts to communicate
    * if you want main to communicate with a window's bundle.js the preload script can expose functions that can be called by the bundle.js scripts

## Mental Model
- 4 major components
    1. main.js - the startup script that runs the app and commonly creates the app window(s)
    2. preload.js - runs in the renderer process for a given window, but has privileged access to NodeJS functions - can expose functions to bundle.js via a context bridge 
        - SEE: https://www.electronjs.org/docs/tutorial/context-isolation
        - SEE: https://github.com/electron/electron/issues/9920#issuecomment-575839738
    3. bundle.js - the script file that gets loaded by the window HTML
    4. window.html - the view HTML for a given window
        * can have script tags that refer to various scripts, but under the current mental model primarily pulls in the bundle.js
- IPC is between main.js "main" process and preload.js "renderer" process
- context bridge allows functions to be exposed from preload.js to bundle.js
