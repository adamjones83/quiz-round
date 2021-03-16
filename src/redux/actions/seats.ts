import { createAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { CreateJumpHandler } from '../jump-handler';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Lineup } from '../../data/types';
import { Map, Set, updateIn } from 'immutable';
import { swapLineup } from '../utils';

const SET_JUMP_HANDLER = 'SET_JUMP_HANDLER';
const ENABLE_SEAT = 'ENABLE_SEAT';
const DISABLE_SEAT = 'DISABLE_SEAT';
const JUMP_CHANGED = 'JUMP_CHANGED';
const JUMP_COMPLETED = 'JUMP_COMPLETED';
const SET_LINEUP = 'SET_LINEUP';
const TOGGLE_SEAT_JUMPED = 'TOGGLE_SEAT_JUMPED';
const SWAP_QUIZZERS = 'SWAP_QUIZZERS';

export const setJumpHandler = createAction<Dispatch>(SET_JUMP_HANDLER);
export const enableSeat = createAction<string>(ENABLE_SEAT);
export const disableSeat = createAction<string>(DISABLE_SEAT);
export const jumpChanged = createAction<string[]>(JUMP_CHANGED);
export const jumpCompleted = createAction<string[]>(JUMP_COMPLETED);
export const setLineup = createAction<{ lineupNum:number, lineup:Lineup }>(SET_LINEUP);
export const toggleSeatJumped = createAction<string>(TOGGLE_SEAT_JUMPED);
export const swapQuizzers = createAction<{ lineupNum:number, seatA:number, seatB:number }>(SWAP_QUIZZERS);

export function addSeatActions(builder:ActionReducerMapBuilder<Map<string,unknown>>) {
    builder
        .addCase(setJumpHandler, (state, action) => state.set('jumpHandler', CreateJumpHandler(action.payload)))
        .addCase(enableSeat, (state,action) => updateIn(state, ['disabledSeats'], (disabledSeats:Set<string>) => disabledSeats.remove(action.payload)))
        .addCase(disableSeat, (state,action) => updateIn(state, ['disabledSeats'], (disabledSeats:Set<string>) => disabledSeats.add(action.payload)))
        .addCase(jumpChanged, (state, action) => state.set('jumped', Set(action.payload)))
        .addCase(setLineup, (state, action) => updateIn(state, ['lineups', action.payload.lineupNum], ()=>action.payload.lineup)).addCase(toggleSeatJumped, (state, action) => 
            updateIn(state, ['jumped'], (jumped:Set<string>) => jumped.has(action.payload) ? jumped.remove(action.payload) : jumped.add(action.payload)))
        .addCase(swapQuizzers, (state, action) => updateIn(state, ['lineups',action.payload.lineupNum], 
            lineup => swapLineup(lineup, action.payload.seatA, action.payload.seatB)));
}