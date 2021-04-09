import * as React from 'react';
import { addTimeout, closePopup } from '../../redux/actions';
import { Lineup, Team, TeamId } from '../../../types';
import { lineupsSelector, teamsSelector, timeLeftSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { TeamSelect } from '../fragments/TeamSelectFragment';
import { timerHandler } from '../../handlers';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { List, Map } from 'immutable';

interface TimeoutPopupProps {
    lineups: List<Lineup>,
    teams: Map<TeamId,Team>,
    timeLeft: number,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    lineups: lineupsSelector(state),
    teams: teamsSelector(state),
    timeLeft: timeLeftSelector(state)
});

/** a popup that can be displayed to control a named timer - timeouts, challenges, appeals */
export const TimeoutPopup = connect(mapStateToProps)((props:TimeoutPopupProps) => {
    const { lineups, teams, timeLeft, dispatch } = props;
    const [teamId, setTeamId] = React.useState(lineups.find(a=>!!a.teamId)?.teamId);
    const [teamSelected, setTeamSelected] = React.useState(false);
    return !teamSelected ? <React.Fragment>
        <TeamSelect {...{teamId,teams:lineups.map(a => teams.get(a.teamId)),setTeamId}} />
        <button onClick={() => {
            setTeamSelected(true); 
            timerHandler.setTimer(30, 'timeout-timer');
            dispatch(addTimeout(teamId));
        } }>OK</button>
        <button onClick={() => dispatch(closePopup())}>Cancel</button>
    </React.Fragment> : <React.Fragment>
        <div>{ timeLeft }</div>
        <div>{ `Timeout - ${teams.get(teamId)?.abbrName}` }</div>
        <div>
            <button onClick={ () => timerHandler.resetTimer() }>Reset</button>
            <button onClick={ () => {
                timerHandler.clearTimer();
                dispatch(closePopup());
            } }>Cancel</button>
        </div>
    </React.Fragment>
});