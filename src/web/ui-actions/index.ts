import { Dispatch } from "redux";
import { QuestionState, QuizzerId, TeamId } from "../../types";
import { nextQuestion, addScore, setQuestionState, AnsweredInfo } from '../redux/actions';
import { jumpHandler, timerHandler } from '../handlers';
import { questionSelector } from "../redux/selectors";

/* 
    EXAMPLE UI ACTIONS:
    jumpset, clearjump,
    correct, error, bonusCorrect, bonusError, cancel
    multipleAnswer, multipleBonusAnswer
    setTimer, clearTimer
*/

function answered(dispatch:Dispatch, teamId:TeamId,quizzerId:QuizzerId,bonus:boolean,correct:boolean) {
    // add score, set question, set question state, clear jump handler
    dispatch(addScore({
        isTeamOnly:bonus,
        teamId, quizzerId, 
        value: !correct ? 0 : bonus ? 10 : 20, 
        type: 'correct'
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
