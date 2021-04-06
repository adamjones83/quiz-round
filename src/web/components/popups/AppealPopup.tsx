import * as React from 'react';
import { addAppeal, closePopup } from '../../redux/actions';
import { Lineup, Quizzer, QuizzerId, Seat, SeatId, Team, TeamId } from '../../../types';
import { lineupsSelector, quizzersSelector, seatsSelector, teamsSelector, timeLeftSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { TeamSelect } from '../fragments/TeamSelectFragment';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { List, Map } from 'immutable';
import { QuizzerSelect } from '../fragments/QuizzerSelectFragment';

interface AppealPopupProps {
    lineups: List<Lineup>,
    teams: Map<TeamId,Team>,
    quizzers: Map<QuizzerId,Quizzer>,
    seats: Map<SeatId,Seat>,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    lineups: lineupsSelector(state),
    teams: teamsSelector(state),
    quizzers: quizzersSelector(state),
    seats: seatsSelector(state)
});

/** a popup that can be displayed to control a named timer - timeouts, challenges, appeals */
export const AppealPopup = connect(mapStateToProps)((props:AppealPopupProps) => {
    const { lineups, teams, quizzers, seats, dispatch } = props;
    const [teamId, setTeamId] = React.useState('');
    const [quizzerId, setQuizzerId] = React.useState('');
    const [appealReady, setAppealReady] = React.useState(false);

    const teamOptions = lineups.map(a => teams.get(a.teamId));
    const quizzerOptions = List(lineups.find(a => a.teamId === teamId)
        ?.quizzerIds.filter(id => id).map(id => quizzers.get(id)) || []);
    const teamSelected = teamId => { 
        setTeamId(teamId); 
        const {captainId, coCaptainId } = lineups.find(a=>a.teamId === teamId);
        const useCaptain = seats.some(a => a.quizzerId === captainId && a.isEnabled);
        const useCoCaptain = seats.some(a => a.quizzerId === coCaptainId && a.isEnabled);
        if(useCaptain) setQuizzerId(captainId);
        else if (useCoCaptain) setQuizzerId(coCaptainId);
    }
    return !appealReady ? <React.Fragment>
        <TeamSelect {...{teamId,teams:teamOptions,setTeamId:teamSelected}} />
        <QuizzerSelect {...{quizzerId,quizzers:quizzerOptions,setQuizzerId}} showNone={false}/>
        <button onClick={() => { setAppealReady(true); } }>OK</button>
        <button onClick={() => dispatch(closePopup())}>Cancel</button>
    </React.Fragment> : <React.Fragment>
        <div>{ `Appeal - ${quizzers.get(quizzerId).abbrName}, ${teams.get(teamId)?.abbrName}` }</div>
        <div>
            <button onClick={ () => { dispatch(addAppeal(teamId,quizzerId,true)); dispatch(closePopup()) }}>Accepted</button>
            <button onClick={ () => { dispatch(addAppeal(teamId,quizzerId,false)); dispatch(closePopup()) }}>Rejected</button>
            <button onClick={ () => dispatch(closePopup())}>Cancel</button>
        </div>
    </React.Fragment>
});