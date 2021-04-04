import * as React from 'react';
import { lineupsSelector, quizzersSelector, teamsSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { Lineup, Quizzer, QuizzerId, Team, TeamId } from '../../../types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Map, List } from 'immutable';
import { addFoul, closePopup } from '../../redux/actions';
import { TeamSelect } from '../fragments/TeamSelectFragment';
import { QuizzerSelect } from '../fragments/QuizzerSelectFragment';

interface TeamQuizzerSelectPopupProps {
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
export const FoulPopup = connect(mapStateToProps)((props:TeamQuizzerSelectPopupProps) => {
    const { teams, quizzers, lineups, dispatch } = props;
    const [teamId, setTeamId] = React.useState(lineups.get(0).teamId);
    const [quizzerId, setQuizzerId] = React.useState('');
    const filteredTeams = teams.toList().filter(t => lineups.some(l => l.teamId === t.id));
    const filteredQuizzers = quizzers.toList()
        .filter(q => lineups.find(a => a.teamId === teamId)?.quizzerIds.includes(q.id));

    return <div>
        <div>Add Foul</div>
        <TeamSelect { ...{teamId,teams:filteredTeams,setTeamId} } />
        <QuizzerSelect { ...{quizzerId,quizzers:filteredQuizzers,setQuizzerId,showNone:true} } />
        <button onClick={ () => { dispatch(addFoul({teamId, quizzerId})); dispatch(closePopup()); } }>Ok</button>
        <button onClick={ () => dispatch(closePopup()) }>Cancel</button>
    </div>
});
