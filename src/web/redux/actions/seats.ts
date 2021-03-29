import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Lineup, QuizzerId, Seat, SeatId, SeatMap } from '../../../types';
import { List, Map, Set, updateIn } from 'immutable';
import { swapLineup } from '../../utils';
import { RoundState } from '../reducer';
import { lineupsSelector } from '../selectors';

const TOGGLE_LINEUP_SELECTION_POPUP = 'TOGGLE_LINEUP_SELECTION_POPUP';
const TOGGLE_SEAT_ENABLED = 'TOGGLE_SEAT_ENABLED'
const UPDATE_LINEUPS = 'UPDATE_LINEUPS';
const SET_LINEUP = 'SET_LINEUP';
const SET_EMPTY_LINEUP = 'SET_EMPTY_LINEUP';
const SET_LINEUP_QUIZZER = 'SET_LINEUP_QUIZZER';
const SET_LINEUP_CAPTAIN = 'SET_LINEUP_CAPTAIN';
const SET_LINEUP_COCAPTAIN = 'SET_LINEUP_COCAPTAIN';
const SWAP_QUIZZERS = 'SWAP_QUIZZERS';
const SET_BONUS_SEATMAPS = 'SET_BONUS_SEATMAPS'

export const toggleLineupSelectionPopup = createAction(TOGGLE_LINEUP_SELECTION_POPUP);
export const toggleSeatEnabled = createAction<SeatId>(TOGGLE_SEAT_ENABLED);
export const updateLineups = createAction<Lineup[]>(UPDATE_LINEUPS);
export const setLineup = createAction<{ lineupNum:number, lineup:Lineup }>(SET_LINEUP);
export const setEmptyLineup = createAction<number>(SET_EMPTY_LINEUP);
export const setLineupQuizzer = createAction<{ lineupNum:number, seatNum:number, quizzerId:QuizzerId }>(SET_LINEUP_QUIZZER);
export const setLineupCaptain = createAction<{ lineupNum:number, captainId:QuizzerId }>(SET_LINEUP_CAPTAIN);
export const setLineupCoCaptain = createAction<{ lineupNum:number, coCaptainId:QuizzerId }>(SET_LINEUP_COCAPTAIN);
export const swapQuizzers = createAction<{ lineupNum:number, seatA:number, seatB:number }>(SWAP_QUIZZERS);
export const setBonusSeatmaps = createAction<SeatMap[]>(SET_BONUS_SEATMAPS);

export function addSeatActions(builder:ActionReducerMapBuilder<RoundState>) {
    builder
        .addCase(toggleLineupSelectionPopup, state => updateIn(state, ['showLineups'], value => !value))
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
        .addCase(setEmptyLineup, (state, action) => {
            const newState = (state as unknown as RoundState).updateIn(['lineups', action.payload], () => ({
                teamId: '', quizzerIds: []
            } as Lineup));
            return updateSeatsFromLineups(newState);
        })
        .addCase(setLineupQuizzer, (state, action) => {
            const newState = (state as unknown as RoundState).updateIn(['lineups', action.payload.lineupNum], (lineup:Lineup) => ({
                ...lineup, quizzerIds: [...lineup.quizzerIds].map((id,index) => index === action.payload.seatNum ? action.payload.quizzerId : id)
            }));
            return updateSeatsFromLineups(newState);
        })
        .addCase(setLineupCaptain, (state,action) => updateIn(state, ['lineups',action.payload.lineupNum], (lineup:Lineup) => ({
            ...lineup, captainId: action.payload.captainId
        })))
        .addCase(setLineupCoCaptain, (state,action) => updateIn(state, ['lineups',action.payload.lineupNum], (lineup:Lineup) => ({
            ...lineup, coCaptainId: action.payload.coCaptainId
        })))
        .addCase(swapQuizzers, (state, action) => updateIn(state, ['lineups',action.payload.lineupNum], 
            lineup => swapLineup(lineup, action.payload.seatA, action.payload.seatB)))
        .addCase(setBonusSeatmaps, (state, action) => updateIn(state, ['bonusSeatMaps'], () => List(action.payload)))
}
/** returns the seat id for a given team number & seat number */
export function getSeatId(teamNum:number, seatNum:number) {
    return `Team ${teamNum} - Seat ${seatNum}`;
}

/** returns the seats that are mapped to get a bonus from a given set of seats */
export function getBonusSeatIds(seatMaps:List<SeatMap>, seatIds:SeatId[]) {
    return seatMaps.filter(a => seatIds.includes(a.from)).map(a => a.to).toSet();
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
