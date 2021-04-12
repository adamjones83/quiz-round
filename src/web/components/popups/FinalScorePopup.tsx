import * as React from 'react';
import { closePopup } from '../../redux/actions';
import { Lineup, Score, Team, TeamId } from '../../../types';
import { lineupsSelector, lineupTeamsSelector, scoresSelector, teamScoreSelector, teamsSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { List, Map } from 'immutable';

interface FinalScorePopupProps {
    lineupTeams: List<Team>,
    teamScores: Record<TeamId, number>,
    dispatch: Dispatch
}

const mapStateToProps = (state: RoundState) => ({
    lineupTeams: lineupTeamsSelector(state),
    teamScores: teamScoreSelector(state),
    scores: scoresSelector(state)
});

export const FinalScorePopup = connect(mapStateToProps)((props: FinalScorePopupProps) => {
    const { lineupTeams, teamScores, dispatch } = props;
    return <React.Fragment>
        <div>
            {lineupTeams.map(team => <div key={team.id}>{`${team.name} finished with ${teamScores[team.id]}`}</div>)}
        </div>
        <button onClick={() => dispatch(closePopup())}>Ok</button>
    </React.Fragment>
});