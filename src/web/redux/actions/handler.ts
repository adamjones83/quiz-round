import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Set } from 'immutable';
import { SeatId } from '../../../types';
import { RoundState } from '../reducer';

const JUMP_CHANGED = 'JUMP_CHANGED';
const JUMP_COMPLETED = 'JUMP_COMPLETED';
const TIMER_CHANGED = 'TIMER_CHANGED';
const TIMER_COMPLETED = 'TIMER_COMPLETED';

export const jumpChanged = createAction<SeatId[]>(JUMP_CHANGED);
export const jumpCompleted = createAction(JUMP_COMPLETED);
export const timerChanged = createAction<TimerChangedInfo>(TIMER_CHANGED);
export const timerCompleted = createAction(TIMER_COMPLETED);

export interface TimerChangedInfo {
    name:string,
    timeLeft:number // seconds
}

export function addHandlerActions(builder:ActionReducerMapBuilder<RoundState>):void {
    builder
        .addCase(jumpChanged, (state, action) => (state as unknown as RoundState)
            .set('jumped', Set(action.payload))
            .update('questionState', value => value === 'jumpset' ? 'answer' : value))
        .addCase(timerChanged, (state, action) => state
            .set('timerName', action.payload.name)
            .set('timeLeft', action.payload.timeLeft));
}
