import { Dispatch } from 'redux';
import { Map, List } from 'immutable';
import { Score } from '../data/types';
import {
    addScore,
    disableSeat,
    enableSeat,
    nextQuestion,
    prevQuestion,
    swapQuizzers
} from './actions';


export function addDebugActions(getState,dispatch:Dispatch) {
    const ACTIONS = {
        disableSeat: (team,seat) => dispatch(disableSeat(`Team ${team} - Seat ${seat}`)),
        enableSeat: (team,seat) => dispatch(enableSeat(`Team ${team} - Seat ${seat}`)),
        nextQuestion: () => dispatch(nextQuestion()),
        prevQuestion: () => dispatch(prevQuestion()),
        swapQuizzers: (lineupNum:number,seatA:number,seatB:number) => dispatch(swapQuizzers({ lineupNum, seatA, seatB})),
        addScoreRaw: (teamId:string, quizzerId?:string, question:number=-1, value:number=20, type:string="Correct") => {
            if(question < 0) question = getState().get('question') as number;
            dispatch(addScore({ question, teamId, quizzerId, isTeamOnly: !quizzerId, value, type }));
        },
        addScore: (team:number,seat:number,question:number=-1,value:number=20,type:string="Correct") => {
            const seatId = `Team ${team} - Seat ${seat}`;
            if(question < 0) question = getState().get('question') as number;
            document.querySelectorAll('.seat').forEach(element => {
                const dataset = (element as HTMLDivElement).dataset;
                if(dataset['seatid'] === seatId) {
                    dispatch(addScore({
                        teamId: dataset['teamid'], quizzerId: dataset['quizzerid'], 
                        isTeamOnly:!dataset['quizzerid'], question, value, type
                    }));
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
            
        }
    };
    Object.assign(global, { ACTIONS });
}