# Quiz Round - Electron App

## Components
- main.js is compiled via `tsc` from main.ts
- preload.js is compiled via `tsc` from preload.ts
- bundle.js is compiled via `npx webpack` from mainWindow.tsx
- mainWindow.html is copied as a static file and used for the main application window
- react & react-dom are loaded as static files and are added as externals for the webpack compile

## Interprocess Communication
- main.js and bundle.js exist in different processes and have different access
- you need some form of IPC
    * preload.js has ways of exposing specific functions
    * search for "electron app preload scripts" for more info