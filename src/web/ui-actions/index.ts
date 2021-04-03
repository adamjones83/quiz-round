import { Dispatch } from "redux";
import { QuestionState, QuizzerId, ScoreType, TeamId } from "../../types";
import { nextQuestion, addScore, setQuestionState, closePopup } from '../redux/actions';
import { jumpHandler, timerHandler } from '../handlers';

/* 
    EXAMPLE UI ACTIONS:
    jumpset, clearjump,
    correct, error, bonusCorrect, bonusError, cancel
    multipleAnswer, multipleBonusAnswer
    setTimer, clearTimer
*/

function answered(dispatch:Dispatch, teamId:TeamId,quizzerId:QuizzerId,bonus:boolean,correct:boolean) {
    // add score, set question, set question state, clear jump handler
    const scoreType:ScoreType = correct ? (bonus ? 'bonus-correct':'correct') :
      (bonus ? 'bonus-error' : 'error');
    
    dispatch(addScore({
        isTeamOnly:bonus,
        teamId, quizzerId, 
        value: !correct ? 0 : bonus ? 10 : 20, 
        type: scoreType
    }));
    if(correct || bonus) dispatch(nextQuestion());
    if(correct || bonus) {
        dispatch(setQuestionState('before'));
        jumpHandler.clear();
    }
    else dispatch(setQuestionState('bonus'));
}
function cancelJump(dispatch:Dispatch) {
    dispatch(setQuestionState('before'));
    jumpHandler.clear();
}
function createTimer(name:string, seconds:number) {
    timerHandler.setTimer(name, seconds);
}
function clearTimer() {
    timerHandler.clearTimer();
}
function setJump(dispatch:Dispatch) {
    dispatch(setQuestionState('jumpset'));
    jumpHandler.set();
}

type Action = () => void;
export interface UiAction {
    name: string,
    action: Action
}

export function getAppUiActions(dispatch:Dispatch, questionState:QuestionState): UiAction[] {
    switch (questionState) {
        case "before":
            return [{ name: "Set", action: () => setJump(dispatch) }];
        case "jumpset":
            return [{ name: "Clear", action: () => cancelJump(dispatch) }];
        default:
            return [];
    }
}
export function getSingleAnswerUiActions(dispatch:Dispatch, teamId:string, quizzerId:string, bonus:boolean, timerSet:boolean): UiAction[] {
    const timerName = bonus ? 'Bonus': 'Jump'
    return [
        !timerSet ? { name: 'Set', action: ()=>createTimer(timerName, 30) } :
            { name: 'Clear', action: clearTimer },
        { name: 'Correct', action: ()=>answered(dispatch,teamId,quizzerId,bonus,true) },
        { name: 'Error', action: ()=>answered(dispatch,teamId,quizzerId,bonus,false) },
        { name: 'Cancel', action: ()=>cancelJump(dispatch) }
    ];
}
export function getTimerPopupUiActions(dispatch:Dispatch): UiAction[] {
    return [
        { name: 'Reset', action: ()=> createTimer('timer', 30) },
        { name: 'Close', action: ()=>{ clearTimer(); dispatch(closePopup()); } }
    ];
}