import { Dispatch } from 'redux';
import { Map, List } from 'immutable';
import { Score, ScoreType } from '../../types';
import {
    addScore,
    getSeatId,
    nextQuestion,
    prevQuestion,
    showPopup,
    swapQuizzers,
    toggleSeatEnabled
} from './actions';
import { nanoid } from 'nanoid';

const roundId = nanoid();
const meetId = nanoid();
function createScore(question:number, teamId:string, quizzerId:string, isTeamOnly:boolean, value:number, type:ScoreType) {
    return { id: nanoid(), roundId, meetId, question, teamId, quizzerId, isTeamOnly, value, type, createdOn: new Date().toISOString().substr(0,10) }
}
export function addDebugActions(getState,dispatch:Dispatch) {
    const ACTIONS = {
        toggleShowLineups: () => dispatch(showPopup('lineups')),
        disableSeat: (team,seat) => dispatch(toggleSeatEnabled(getSeatId(team,seat))),
        nextQuestion: () => dispatch(nextQuestion()),
        prevQuestion: () => dispatch(prevQuestion()),
        swapQuizzers: (lineupNum:number,seatA:number,seatB:number) => dispatch(swapQuizzers({ lineupNum, seatA, seatB})),
        addScoreRaw: (teamId:string, quizzerId?:string, question:number=-1, value:number=20, type:ScoreType="correct") => {
            if(question < 0) question = getState().get('question') as number;
            dispatch(addScore(createScore(question, teamId, quizzerId, !quizzerId, value, type)));
        },
        addScore: (team:number,seat:number,question:number=-1,value:number=20,type:ScoreType="correct") => {
            const seatId = `Team ${team} - Seat ${seat}`;
            if(question < 0) question = getState().get('question') as number;
            document.querySelectorAll('.seat').forEach(element => {
                const dataset = (element as HTMLDivElement).dataset;
                if(dataset['seatid'] === seatId) {
                    dispatch(addScore(createScore(question, dataset['teamid'], dataset['quizzerid'], !dataset['quizzerid'], value, type)));
                }
            })
        },
        printScores: () => {
            const state = getState() as Map<string,unknown>;
            const getQuizzer = (score:Score) => state.getIn(['quizzers',score.quizzerId])?.abbrName;
            const getTeam = (score:Score) => state.getIn(['teams', score.teamId])?.name;
            const scores = (state.get('scores') as List<Score>)
                .map(s => `#${s.question} ${getTeam(s)} - ${getQuizzer(s)}: ${s.value} pts (${s.type})`);
            scores.forEach(a => console.log(a));
        },
        showScores: () => {
            dispatch(showPopup('scores'));
        }
    };
    Object.assign(global, { ACTIONS });
}