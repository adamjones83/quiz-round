import * as React from 'react';
import { Popup } from './Popup';
import { getTimerPopupUiActions } from '../ui-actions';
import { lineupsSelector, showPopupSelector, teamsSelector, timeLeftSelector, timerNameSelector } from '../redux/selectors';
import { RoundState } from '../redux/reducer';
import { Team, TeamId } from '../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Map } from 'immutable';

interface TimerPopupProps {
    teamId: TeamId,
    teams: Map<TeamId,Team>,
    name: string,
    timeLeft: number,
    showTimer: boolean,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    teamId: lineupsSelector(state).get(0).teamId,
    teams: teamsSelector(state),
    name: timerNameSelector(state),
    timeLeft: timeLeftSelector(state),
    showTimer: showPopupSelector(state) === 'timer'
});

/** a popup that can be displayed to control a named timer - timeouts, challenges, appeals */
export const TimerPopup = connect(mapStateToProps)((props:TimerPopupProps) => {
    const { teamId, teams, name, timeLeft, showTimer, dispatch } = props;
    const display = `Timeout - ${teams.get(teamId)?.name}`;

    const uiActions = getTimerPopupUiActions(dispatch);
    return <Popup visible={showTimer}>
            <div>{ timeLeft }</div>
            <div>{ display }</div>
            <div>
                { uiActions.map(a => <button key={a.name} onClick={ a.action }>{ a.name }</button>) }
            </div>
        </Popup>
});
