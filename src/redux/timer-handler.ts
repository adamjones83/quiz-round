import { Dispatch } from 'redux';
import { timerChanged as timerChangedAction, timerCompleted as timerCompletedAction } from './actions';

export function TimerHandler(dispatch:Dispatch) {
    let expiresId = null;
    let updateId = null;
    let expiresTime:number = null;
    let timerName:string = null;
    
    /** called when a set timer completes to dispatch the timer-completed action */
    const timerCompleted = () => dispatch(timerCompletedAction());
    /** called when the timer is updated to dispatch the timer-updated action */
    const timerChanged = () => dispatch(timerChangedAction({ 
        name: timerName, 
        timeLeft: expiresTime ? 0 : Math.max(0, Math.round((expiresTime - Date.now()) / 1000))
    }));
    
    const clearTimer = () => {
        timerName = null;
        expiresTime = null;
        if(expiresId) clearTimeout(expiresId);
        if(updateId) clearInterval(updateId);
        timerChanged();
    }
    const setTimer = (name:string, seconds:number) => {
        timerName = name;
        expiresTime = Date.now() + seconds * 1000;
        expiresId = setTimeout(() => { timerCompleted(); clearTimer(); }, seconds * 1000);
        updateId = setInterval(() => timerChanged(), 1000);
        timerChanged();
    }
    return { setTimer, clearTimer };
}
