import { ipcRenderer } from 'electron';
import { DATA_REQUEST, DataRequestType, DATA_SAVE, DataSaveType } from '../ipc-types';
import { Quizzer, Team, Lineup, Meet, QuizClient, Round, Score } from '../types';


function dataRequest<T>(name:DataRequestType) {
    return () => new Promise<T>(res => {
        ipcRenderer.once(`${DATA_REQUEST}:${name}`, (_,args) => {
            res(args as T);    
        });
        ipcRenderer.send(DATA_REQUEST, name);
    });
}
function dataSave<T>(name:DataSaveType) {
    return (data:T) => new Promise<void>(res => {
        ipcRenderer.once(`${DATA_SAVE}:${name}`, () => res(undefined));
        ipcRenderer.send(DATA_SAVE, { name, data });
    });
}
export function ElectronClient() : QuizClient {
    return {
        getQuizzers: dataRequest<Quizzer[]>('get-quizzers'),
        getTeams: dataRequest<Team[]>('get-teams'),
        getDefaultLineups: dataRequest<Lineup[]>('get-lineups'),
        getMeets: dataRequest<Meet[]>('get-meets'),

        saveQuizzer: dataSave<Quizzer>('save-quizzer'),
        saveTeam: dataSave<Team>('save-team'),
        saveDefaultLineup: dataSave<Lineup>('save-default-lineup'),
        saveMeet: dataSave<Meet>('save-meet'),
        saveRound: dataSave<Round>('save-round'),
        saveScores: dataSave<Score[]>('save-scores')
    }
}