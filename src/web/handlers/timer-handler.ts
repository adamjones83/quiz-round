/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch } from 'redux';
import { TimerType } from '../../types';
import { timerChanged, timerCompleted } from '../redux/actions';

export interface TimerHandler {
    setTimer: (seconds:number, type: TimerType) => void,
    resetTimer: () => void,
    clearTimer: () => void
}

function CreateTimerHandler(dispatch:Dispatch) {
    let expiresId = null;
    let updateId = null;
    let initialTime = 0;
    let expiresTime:number = null;
    let timerType:TimerType = undefined;

    /** called when a set timer completes to dispatch the timer-completed action */
    const timerCompletedInner = () => dispatch(timerCompleted(timerType));
    /** called when the timer is updated to dispatch the timer-updated action */
    const timerChangedInner = () => {
        dispatch(timerChanged( 
            !expiresTime ? 0 : Math.max(0, Math.round((expiresTime - Date.now()) / 1000))
        ));
    };
    
    const clearTimer = () => {
        expiresTime = null;
        if(expiresId) clearTimeout(expiresId);
        if(updateId) clearInterval(updateId);
        timerChangedInner();
    }
    const resetTimer = () => {
        setTimer(initialTime, timerType);
    }
    const setTimer = (seconds:number, type:TimerType) => {
        timerType = type;
        initialTime = 30;
        expiresTime = Date.now() + seconds * 1000;
        expiresId = setTimeout(() => { timerCompletedInner(); clearTimer(); }, seconds * 1000);
        updateId = setInterval(() => timerChangedInner(), 1000);
        timerChangedInner();
    }
    return { setTimer, resetTimer, clearTimer };
}

export const timerHandler:TimerHandler = {
    setTimer: () => { },
    resetTimer: () => { },
    clearTimer: () => { }
};

export function initTimerHandler(dispatch:Dispatch):void {
    Object.assign(timerHandler, CreateTimerHandler(dispatch));
}