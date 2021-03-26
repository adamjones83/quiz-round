import { promises as fs } from 'fs';
import { ipcRenderer } from 'electron';
import { Quizzer, Team } from './data/types';
import { QuizRoundClient } from './sqlite/data-layer';

/*
// example of sync IPC messaging
console.log(ipcRenderer.sendSync('synchronous-message', 'dab'));

// example of async IPC messaging
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log('we got a reply!', event);
});
ipcRenderer.send('asynchronous-message', 'dab');
*/
async function fileLoadQuizzers() {
    const data = await fs.readFile('target/data/quizzers.json', { encoding: 'utf8' })
    return JSON.parse(data) as Quizzer[];
}
async function fileLoadTeams() {
    const data = await fs.readFile('target/data/teams.json', { encoding: 'utf8' })
    return JSON.parse(data) as Team[];
}

export interface ExposedFunctions {
    loadQuizzers: () => Promise<Quizzer[]>,
    loadTeams: () => Promise<Team[]>
}
const exposed:ExposedFunctions = { 
    loadQuizzers: fileLoadQuizzers,
    loadTeams: fileLoadTeams
}

// TODO: this is BAD, use a context bridge instead which basically works the same but avoids a security bug SEE
Object.assign(window, exposed);