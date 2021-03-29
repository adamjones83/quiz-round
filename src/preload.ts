import { promises as fs } from 'fs';
import { ipcRenderer } from 'electron';
import { Lineup, Quizzer, Team } from './data/types';
import { QuizRoundClient } from './database/lib/data-layer';
import { MenuEventHandler, menuEvents } from './menu/menu-handler';
/*
// example of sync IPC messaging
console.log(ipcRenderer.sendSync('synchronous-message', 'dab'));

// example of async IPC messaging
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log('we got a reply!', event);
});
ipcRenderer.send('asynchronous-message', 'dab');
*/

async function readJson<T>(filepath:string) {
    const data = await fs.readFile(filepath, { encoding: 'utf8' });
    return JSON.parse(data) as T;
}

export interface ExposedFunctions {
    getQuizzers: () => Promise<Quizzer[]>,
    getTeams: () => Promise<Team[]>,
    getLineups: () => Promise<Lineup[]>,
    addEventHandler: (handler:MenuEventHandler)=>void
}
const client = QuizRoundClient('sample.db')
const exposed:ExposedFunctions = { 
    getQuizzers: client.getQuizzers,
    getTeams: client.getTeams,
    getLineups: client.getLineups,
    addEventHandler: menuEvents.addHandler
}

// TODO: this is BAD, use a context bridge instead which basically works the same but avoids a security bug SEE
Object.assign(window, exposed);