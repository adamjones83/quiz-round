import * as React from "react";
import { Popup } from "./Popup"
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Quizzer, Score, Team } from '../../types';
import { RoundState } from "../redux/reducer";
import { quizzersSelector, scoresSelector, showPopupSelector, teamsSelector, timeLeftSelector, timerNameSelector } from "../redux/selectors";
import { Dispatch } from "redux";
import { removeScore, toggleShowScores } from "../redux/actions";
import { getTimerPopupUiActions } from "../ui-actions";

interface TimerPopupProps {
    name: string,
    timeLeft: number,
    showTimer: boolean,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    name: timerNameSelector(state),
    timeLeft: timeLeftSelector(state),
    showTimer: showPopupSelector(state) === 'timer'
});

/** a popup that can be displayed to control a named timer - timeouts, challenges, appeals */
export const TimerPopup = connect(mapStateToProps)((props:TimerPopupProps) => {
    const { name, timeLeft, showTimer, dispatch } = props;
    const uiActions = getTimerPopupUiActions(dispatch);
    return <Popup visible={showTimer}>
            <div>{ timeLeft }</div>
            <div>{ name }</div>
            <div>
                { uiActions.map}
            </div>
        </Popup>
});
