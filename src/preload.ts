import { promises as fs } from 'fs';
import { ipcRenderer } from 'electron';
import { Lineup, QuizClient, Quizzer, Team } from './types';
import { QuizRoundClient } from './app/database/lib/data-layer';
import { MenuEventHandler, menuEvents } from './app/menu/menu-handler';
import { DATA_REQUEST, DataRequestType, MENU_EVENT } from './ipc-types';


ipcRenderer.on(MENU_EVENT, (_,args) => {
    window.console.log('Menu Event', args);
});

function dataRequest<T>(name:DataRequestType) {
    return () => new Promise<T>(res => {
        ipcRenderer.once(`data-request:${name}`, (_,args) => {
            res(args as T);    
        });
        ipcRenderer.send('data-request', name);
    });
}
function ElectronClient() : QuizClient {
    return {
        getQuizzers: dataRequest<Quizzer[]>('get-quizzers'),
        getTeams: dataRequest<Team[]>('get-teams'),
        getLineups: dataRequest<Lineup[]>('get-lineups')
    }
}
const client = ElectronClient();
Object.assign(window, { client });