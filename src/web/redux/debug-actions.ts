/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Dispatch } from 'redux';
import { Map, List } from 'immutable';
import { Score } from '../../types';
import {
    getSeatId,
    nextQuestion,
    prevQuestion,
    showPopup,
    swapQuizzers,
    toggleSeatEnabled
} from './actions';
import { RoundState } from './reducer';

export function addDebugActions(getState:()=>RoundState,dispatch:Dispatch):void {
    const ACTIONS = {
        toggleShowLineups: () => dispatch(showPopup('lineups')),
        disableSeat: (team,seat) => dispatch(toggleSeatEnabled(getSeatId(team,seat))),
        nextQuestion: () => dispatch(nextQuestion()),
        prevQuestion: () => dispatch(prevQuestion()),
        swapQuizzers: (lineupNum:number,seatA:number,seatB:number) => dispatch(swapQuizzers({ lineupNum, seatA, seatB})),
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