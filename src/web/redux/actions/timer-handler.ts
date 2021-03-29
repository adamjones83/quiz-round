import { Dispatch } from 'redux';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { RoundState } from '../reducer';

const TIMER_CHANGED = 'TIMER_CHANGED';
const TIMER_COMPLETED = 'TIMER_COMPLETED';
const SET_TIMER_HANDLER = 'SET_TIMER_HANDLER';

export const timerChanged = createAction<TimerChangedInfo>(TIMER_CHANGED);
export const timerCompleted = createAction(TIMER_COMPLETED);
export const setTimerHandler = createAction<Dispatch>(SET_TIMER_HANDLER);

export interface TimerChangedInfo {
    name:string,
    timeLeft:number // seconds
}
export interface TimerHandler {
    setTimer: (name:string, seconds:number) => void, 
    clearTimer: () => void
}

export function CreateTimerHandler(dispatch:Dispatch) {
    let expiresId = null;
    let updateId = null;
    let expiresTime:number = null;
    let timerName:string = null;
    
    /** called when a set timer completes to dispatch the timer-completed action */
    const timerCompletedInner = () => dispatch(timerCompleted());
    /** called when the timer is updated to dispatch the timer-updated action */
    const timerChangedInner = () => dispatch(timerChanged({ 
        name: timerName, 
        timeLeft: expiresTime ? 0 : Math.max(0, Math.round((expiresTime - Date.now()) / 1000))
    }));
    
    const clearTimer = () => {
        timerName = null;
        expiresTime = null;
        if(expiresId) clearTimeout(expiresId);
        if(updateId) clearInterval(updateId);
        timerChangedInner();
    }
    const setTimer = (name:string, seconds:number) => {
        timerName = name;
        expiresTime = Date.now() + seconds * 1000;
        expiresId = setTimeout(() => { timerCompletedInner(); clearTimer(); }, seconds * 1000);
        updateId = setInterval(() => timerChangedInner(), 1000);
        timerChangedInner();
    }
    return { setTimer, clearTimer };
}

export function addTimerActions(builder:ActionReducerMapBuilder<RoundState>) {
    builder
    .addCase(setTimerHandler, (state,action) => state.set('timerHandler', CreateTimerHandler(action.payload)))
    .addCase(timerChanged, (state, action) => state
            .set('timerName', action.payload.name)
            .set('timeLeft', action.payload.timeLeft));
}