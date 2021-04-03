/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch } from 'redux';
import { timerChanged, timerCompleted } from '../redux/actions';

export interface TimerHandler {
    setTimer: (name:string, seconds:number) => void, 
    clearTimer: () => void
}

function CreateTimerHandler(dispatch:Dispatch) {
    let expiresId = null;
    let updateId = null;
    let expiresTime:number = null;
    let timerName:string = null;
    
    /** called when a set timer completes to dispatch the timer-completed action */
    const timerCompletedInner = () => dispatch(timerCompleted());
    /** called when the timer is updated to dispatch the timer-updated action */
    const timerChangedInner = () => {
        dispatch(timerChanged({ 
            name: timerName, 
            timeLeft: !expiresTime ? 0 : Math.max(0, Math.round((expiresTime - Date.now()) / 1000))
        }));
        console.log({ timerName, expiresTime, now:Date.now() });
    };
    
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
        console.log({ timerName, expiresTime });
    }
    return { setTimer, clearTimer };
}

export const timerHandler:TimerHandler = {
    setTimer: () => { },
    clearTimer: () => { }
};

export function initTimerHandler(dispatch:Dispatch):void {
    Object.assign(timerHandler, CreateTimerHandler(dispatch));
}