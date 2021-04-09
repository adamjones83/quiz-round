import { Dispatch } from "redux";
import { QuestionState, QuizzerId, TeamId } from "../../types";
import { nextQuestion, addAnswered, setQuestionState, closePopup } from '../redux/actions';
import { jumpHandler, timerHandler } from '../handlers';

/* 
    EXAMPLE UI ACTIONS:
    jumpset, clearjump,
    correct, error, bonusCorrect, bonusError, cancel
    multipleAnswer, multipleBonusAnswer
    setTimer, clearTimer
*/

function answered(dispatch: Dispatch, teamId: TeamId, quizzerId: QuizzerId, bonus: boolean, correct: boolean) {
    // add score, set question, set question state, clear jump handler
    dispatch(addAnswered(teamId, quizzerId, correct, bonus));
    if (correct || bonus) {
        dispatch(nextQuestion());
        dispatch(setQuestionState('before'));
        jumpHandler.clear();
        dispatch(closePopup());
    }
    else dispatch(setQuestionState('bonus'));
}
function cancelJump(dispatch: Dispatch) {
    dispatch(setQuestionState('before'));
    dispatch(closePopup());
    jumpHandler.clear();
}
function setJump(dispatch: Dispatch) {
    jumpHandler.set();
    dispatch(setQuestionState('jumpset'));
}

type Action = () => void;
export interface UiAction {
    name: string,
    action: Action
}

export function getAppUiActions(dispatch: Dispatch, questionState: QuestionState): UiAction[] {
    switch (questionState) {
        case "before":
            return [{ name: "Set", action: () => setJump(dispatch) }];
        case "jumpset":
            return [{ name: "Clear", action: () => cancelJump(dispatch) }];
        default:
            return [];
    }
}
export function getSingleAnswerUiActions(dispatch: Dispatch, teamId: string, quizzerId: string, bonus: boolean, timerSet: boolean): UiAction[] {
    return [
        !timerSet ? { name: 'Set', action: () => timerHandler.setTimer(3, 'jump-timer') } :
            { name: 'Clear', action: () => timerHandler.clearTimer() },
        { name: 'Correct', action: () => answered(dispatch, teamId, quizzerId, bonus, true) },
        { name: 'Error', action: () => answered(dispatch, teamId, quizzerId, bonus, false) },
        { name: 'Cancel', action: () => cancelJump(dispatch) }
    ];
}