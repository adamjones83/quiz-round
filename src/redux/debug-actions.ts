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
        addScore: (teamId:string, quizzerId:string) => dispatch(addScore({
            question: getState().get('question') as number,
            teamId, quizzerId, isTeamOnly: !quizzerId, value: 20, type: 'Correct'
        })),
        addScoreForSeat: (team:number,seat:number) => {
            const seatId = `Team ${team} - Seat ${seat}`;
            document.querySelectorAll('.seat').forEach(element => {
                const dataset = (element as HTMLDivElement).dataset;
                if(dataset['seatid'] === seatId) {
                    dispatch(addScore({
                        question: getState().get('question') as number,
                        teamId: dataset['teamid'], quizzerId: dataset['quizzerid'], 
                        isTeamOnly:false, value: 20, type: 'Correct'
                    }));
                }
            })
        },
        printScores: () => {
            const state = getState() as Map<string,unknown>;
            const getQuizzer = (score:Score) => state.getIn(['quizzers',score.quizzerId])?.name;
            const getTeam = (score:Score) => state.getIn(['teams', score.teamId])?.name;
            const scores = (state.get('scores') as List<Score>)
                .map(s => `${getTeam(s)} - ${getQuizzer(s)}: ${s.value} points (${s.type})`);
            scores.forEach(a => console.log(a));
            
        }
    };
    Object.assign(global, { ACTIONS });
}