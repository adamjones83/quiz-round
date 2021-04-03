import { ipcMain } from 'electron';
import { QuizRoundClient } from './lib/data-layer';
import { DATA_REQUEST, DataRequestType, DATA_SAVE, DataSaveType } from '../../ipc-types';
import { Quizzer, Team, Lineup, Meet, Round, Score } from '../../types';


// set up electron quiz client IPC
const client = QuizRoundClient('sample.db')
ipcMain.on(DATA_REQUEST, async (evt,name:DataRequestType) => {
    const responseChannel = `${DATA_REQUEST}:${name}`;
    console.log(`DATA REQUEST: '${name}'`);
    switch(name) {
        case 'get-quizzers':
            evt.reply(responseChannel, await client.getQuizzers());
            break;
        case 'get-teams':
            evt.reply(responseChannel, await client.getTeams());
            break;
        case 'get-lineups':
            evt.reply(responseChannel, await client.getLineups());
            break;
        case 'get-meets':
            evt.reply(responseChannel, await client.getMeets());
            break;
        default: break;
    }
});
ipcMain.on(DATA_SAVE, async (evt,args:{name:DataSaveType,data:unknown}) => {
    const { name, data } = args;
    const responseChannel = `${DATA_SAVE}:${name}`
    switch(name) {
        case 'save-quizzer':
            await client.insertQuizzer(data as Quizzer);
            break;
        case 'save-team':
            await client.insertTeam(data as Team);
            break;
        case 'save-default-lineup':
            await client.insertLineup(data as Lineup);
            break;
        case 'save-meet':
            await client.insertMeet(data as Meet);
            break;
        case 'save-round':
            await client.insertRound(data as Round);
            break;
        case 'save-scores':
            await client.insertScores(data as Score[]);
            break;
        default:
            throw 'unrecognized save type';
    }
    evt.reply(responseChannel);
});


