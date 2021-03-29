import * as React from "react";
import { Popup } from "./Popup"
import { connect } from 'react-redux';
import { getIn, List, Map } from 'immutable';
import { Lineup, Quizzer, QuizzerId, Team, TeamId } from '../../types';
import { RoundState } from "../redux/reducer";
import { defaultLineupsSelector, lineupsSelector, quizzersSelector, showLineupsSelector, teamsSelector } from "../redux/selectors";
import { Dispatch } from "redux";
import { setLineup, setLineupCaptain, setLineupCoCaptain, setLineupQuizzer } from "../redux/actions";

interface LineupsPopupProps {
    showLineups: boolean,
    teams: Map<string,Team>,
    quizzers: Map<string,Quizzer>,
    defaultLineups: Map<string,Lineup>,
    lineups: List<Lineup>,
    dispatch: Dispatch
}
const mapStateToProps = (state:RoundState) => ({
    showLineups: showLineupsSelector(state),
    teams: teamsSelector(state),
    quizzers: quizzersSelector(state),
    defaultLineups: defaultLineupsSelector(state),
    lineups: lineupsSelector(state)
});

export const LineupsPopup = connect(mapStateToProps, dispatch => ({dispatch}))((props:LineupsPopupProps) => {
    const { lineups, showLineups } = props;
    return <Popup visible={ showLineups }>
        <div className={'lineups-popup'}>
            <div className={'flex-row'}>
            {
                [...new Array(3)]
                    .map((_,index) => lineups.get(index) || { } as Lineup)
                    .map((lineup,index) => <LineupSelection  {...props} key={index} lineupNum={index} lineup={lineup} />)
            }
            </div>
            <button>Close</button>
        </div>
    </Popup>
});

const LineupSelection = (props:{ dispatch:Dispatch, lineupNum:number, lineup:Lineup, teams:Map<string,Team>, quizzers:Map<string,Quizzer>, defaultLineups:Map<string,Lineup> }) => {
    const { lineup, teams, quizzers, defaultLineups, lineupNum, dispatch } = props;
    const team = teams.get(lineup.teamId);
    return <div style={{flex:1}} className={'lineup-selection'}>
        <div>Team:</div>
        <select value={team?.id} onChange={ evt => LineupTeamChanged(dispatch, lineupNum, evt.target.value, defaultLineups) } >
            <option value=''>--none--</option>
            { teams.toList().map(t=><option key={t.id} value={t.id}>{t.name}</option>) }
        </select>
        <div>Quizzers:</div>
        { 
            [...new Array(5)]
                .map((_,index) => quizzers.get(getIn(lineup, ['quizzerIds', index], '')))
                .map((quizzer,index) => <select value={quizzer?.id} key={index} onChange={ evt => LineupQuizzerChanged(dispatch,lineupNum,index,evt.target.value)}>
                    <option value=''>--none--</option>
                    { quizzers.toList().map(q =><option key={q.id} value={q.id}>{q.name}</option>) }
                </select>)
        }
        <div>Captain:</div>
        <select value={lineup.captainId} onChange={ evt => CaptainChanged(dispatch, lineupNum, evt.target.value) }>
            <option value=''>--none--</option>
            { (lineup.quizzerIds || [])
                .map(id => quizzers.get(id))
                .filter(quizzer => !!quizzer)
                .map(quizzer => <option key={quizzer.id} value={quizzer.id}>{quizzer.abbrName}</option> ) }
        </select>
        <div>Cocaption:</div>
        <select value={lineup.coCaptainId} onChange={ evt => CoCaptainChanged(dispatch, lineupNum, evt.target.value) }>
            <option value=''>--none--</option>
            { (lineup.quizzerIds || [])
                .map(id => quizzers.get(id))
                .filter(quizzer => !!quizzer)
                .map(quizzer => <option key={quizzer.id} value={quizzer.id}>{quizzer.abbrName}</option> ) }
        </select>
    </div>
}

function LineupTeamChanged(dispatch:Dispatch, lineupNum:number, teamId:TeamId, defaultLineups:Map<TeamId,Lineup>) {
    const lineup:Lineup = defaultLineups.get(teamId);
    dispatch(setLineup({ lineupNum, lineup }));
}
function LineupQuizzerChanged(dispatch:Dispatch, lineupNum:number, seatNum:number, quizzerId:QuizzerId) {
    dispatch(setLineupQuizzer({ lineupNum, seatNum, quizzerId }));
}
function CaptainChanged(dispatch:Dispatch, lineupNum:number, captainId:QuizzerId) {
    dispatch(setLineupCaptain({ lineupNum, captainId }));
}
function CoCaptainChanged(dispatch:Dispatch, lineupNum:number, coCaptainId:QuizzerId) {
    dispatch(setLineupCoCaptain({ lineupNum, coCaptainId }));
}