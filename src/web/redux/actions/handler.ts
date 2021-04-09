import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Set } from 'immutable';
import { PopupType, QuestionState, SeatId, TimerType } from '../../../types';
import { RoundState } from '../reducer';
import { playSound } from '../../handlers/sound-handler';

const JUMP_CHANGED = 'JUMP_CHANGED';
const JUMP_COMPLETED = 'JUMP_COMPLETED';
const TIMER_CHANGED = 'TIMER_CHANGED';
const TIMER_COMPLETED = 'TIMER_COMPLETED';

export const jumpChanged = createAction<SeatId[]>(JUMP_CHANGED);
export const jumpCompleted = createAction(JUMP_COMPLETED);
export const timerChanged = createAction<number>(TIMER_CHANGED);
export const timerCompleted = createAction<TimerType>(TIMER_COMPLETED);

export function addHandlerActions(builder:ActionReducerMapBuilder<RoundState>):void {
    builder
        .addCase(jumpChanged, (state, action) => (state as unknown as RoundState)
            .set('jumped', Set(action.payload)))
        .addCase(jumpCompleted, state => {
            playSound('jump');
            return (state as unknown as RoundState)
                .set('questionState', 'answer' as QuestionState)
                .set('showPopup', 'jump' as PopupType)
        })
        .addCase(timerChanged, (state, action) => state
            .set('timeLeft', action.payload))
        .addCase(timerCompleted, (state,action) => {
            console.log('yeah this happened');
            playSound(action.payload);
            return state;
        });
}
