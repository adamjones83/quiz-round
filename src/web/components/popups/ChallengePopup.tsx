import * as React from 'react';
import { lineupsSelector, quizzersSelector, teamsSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { Lineup, Quizzer, QuizzerId, Team, TeamId } from '../../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Map, List } from 'immutable';
import { addChallenge, closePopup } from '../../redux/actions';
import { TeamSelect } from '../fragments/TeamSelectFragment';
import { QuizzerSelect } from '../fragments/QuizzerSelectFragment';

interface ChallengePopupProps {
    teams: Map<TeamId,Team>,
    quizzers: Map<QuizzerId, Quizzer>,
    lineups: List<Lineup>,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    teams: teamsSelector(state),
    quizzers: quizzersSelector(state),
    lineups: lineupsSelector(state)
});


/** A popup for recording a foul on a given team/player */
export const ChallengePopup = connect(mapStateToProps)((props:ChallengePopupProps) => {
    const { teams, quizzers, lineups, dispatch } = props;
    const [teamId, setTeamId] = React.useState(lineups.get(0).teamId);
    const [quizzerId, setQuizzerId] = React.useState('');
    const filteredTeams = teams.toList().filter(t => lineups.some(l => l.teamId === t.id));
    const filteredQuizzers = quizzers.toList()
        .filter(q => lineups.find(a => a.teamId === teamId)?.quizzerIds.includes(q.id));

    return <div>
        <div>Challenge</div>
        <TeamSelect { ...{teamId,teams:filteredTeams,setTeamId} } />
        <QuizzerSelect { ...{quizzerId,quizzers:filteredQuizzers,setQuizzerId,showNone:true} } />
        <button onClick={ () => { dispatch(addChallenge(teamId,quizzerId,true)); dispatch(closePopup()); } }>Accept</button>
        <button onClick={ () => { dispatch(addChallenge(teamId,quizzerId,true)); dispatch(closePopup()); } }>Reject</button>
        <button onClick={ () => dispatch(closePopup()) }>Cancel</button>
    </div>
});
