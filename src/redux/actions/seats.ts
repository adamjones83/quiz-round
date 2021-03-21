import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Lineup, Seat, SeatId } from '../../data/types';
import { List, Map, Set, updateIn } from 'immutable';
import { swapLineup } from '../utils';
import { RoundState } from '../reducer';

const TOGGLE_SEAT_ENABLED = 'TOGGLE_SEAT_ENABLED'
const UPDATE_LINEUPS = 'UPDATE_LINEUPS';
const SET_LINEUP = 'SET_LINEUP';
const SWAP_QUIZZERS = 'SWAP_QUIZZERS';

export const toggleSeatEnabled = createAction<SeatId>(TOGGLE_SEAT_ENABLED);
export const updateLineups = createAction<Lineup[]>(UPDATE_LINEUPS);
export const setLineup = createAction<{ lineupNum:number, lineup:Lineup }>(SET_LINEUP);
export const swapQuizzers = createAction<{ lineupNum:number, seatA:number, seatB:number }>(SWAP_QUIZZERS);

export function addSeatActions(builder:ActionReducerMapBuilder<RoundState>) {
    builder
        .addCase(toggleSeatEnabled, (state, { payload })=> updateIn(state, ['seats',payload], (seat:Seat) => ({
            ...seat,
            isEnabled: !seat.isEnabled
        } as Seat)))
        .addCase(updateLineups, (state, action) => { 
            const newState = (state as unknown as RoundState).set('lineups', List(action.payload));
            return updateSeatsFromLineups(newState);
        })
        .addCase(setLineup, (state, action) => {
            const newState = (state as unknown as RoundState).updateIn(['lineups', action.payload.lineupNum], () => action.payload.lineup);
            return updateSeatsFromLineups(newState);
        })
        .addCase(swapQuizzers, (state, action) => updateIn(state, ['lineups',action.payload.lineupNum], 
            lineup => swapLineup(lineup, action.payload.seatA, action.payload.seatB)))
}

// TODO: change hard coded seat ids in code to use this function
export function getSeatId(teamNum:number, seatNum:number) {
    return `Team ${teamNum} - Seat ${seatNum}`;
}

/** updates the seat team & quizzer ids from the current lineups, returns the updated copy of the state */
function updateSeatsFromLineups(state:RoundState) {
    const lineups = state.get('lineups') as List<Lineup>;
    // get an array of 15, map to { teamNum, seatNum } for 3 teams of 5, update teamId & quizzerId for the seatId from the lineup
    return [...new Array(15)]
        .map((_,a) => ({ teamNum: Math.floor(a / 5), seatNum: a % 5 }))
        .reduce((newState, { teamNum, seatNum }) => {
            const lineup = lineups.get(teamNum);
            const teamId = lineup?.teamId;
            const quizzerId = lineup?.quizzerIds[seatNum];
            const seatId = getSeatId(teamNum, seatNum);
            return newState.updateIn(['seats',seatId], () => ({
                id:seatId, teamId, quizzerId, isEnabled: !!quizzerId
            } as Seat));
        }, state);
}
