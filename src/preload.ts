import { promises as fs } from 'fs';
import { ipcRenderer } from 'electron';

/*
// example of sync IPC messaging
console.log(ipcRenderer.sendSync('synchronous-message', 'dab'));

// example of async IPC messaging
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log('we got a reply!', event);
});
ipcRenderer.send('asynchronous-message', 'dab');
*/

async function save() {
    const data = { one: 1 };
    await fs.writeFile('data.json', JSON.stringify(data));
}

export interface ExposedFunctions {
    save: () => void
}
const exposed:ExposedFunctions = { 
    save
}

// TODO: this is BAD, use a context bridge instead which basically works the same but avoids a security bug SEE
Object.assign(window, exposed);