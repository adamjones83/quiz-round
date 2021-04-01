import * as React from "react";
import { Popup } from "./Popup"
import { connect } from 'react-redux';
import { getIn, List, Map } from 'immutable';
import { Lineup, Quizzer, QuizzerId, Team, TeamId } from '../../types';
import { RoundState } from "../redux/reducer";
import { defaultLineupsSelector, lineupsSelector, quizzersSelector, showPopupSelector, teamsSelector } from "../redux/selectors";
import { Dispatch } from "redux";
import { closePopup, setLineup, setLineupCaptain, setLineupCoCaptain, setLineupQuizzer } from "../redux/actions";

interface LineupsPopupProps {
    showLineups: boolean,
    teams: Map<string,Team>,
    quizzers: Map<string,Quizzer>,
    defaultLineups: Map<string,Lineup>,
    lineups: List<Lineup>,

    teamChanged:(lineupNum:number, teamId:TeamId, defaultLineups:Map<TeamId,Lineup>)=>void,
    quizzerChanged:(lineupNum:number, seatNum:number, quizzerId:QuizzerId)=>void,
    captainChanged:(lineupNum:number, captainId:QuizzerId)=>void,
    coCaptainChanged:(lineupNum:number, coCaptainId:QuizzerId)=>void,
    closeDialog:()=>void
};

const mapStateToProps = (state:RoundState) => ({
    showLineups: showPopupSelector(state) === 'lineups',
    teams: teamsSelector(state),
    quizzers: quizzersSelector(state),
    defaultLineups: defaultLineupsSelector(state),
    lineups: lineupsSelector(state)
});

function mapDispatchToProps(dispatch:Dispatch) {
    function teamChanged(lineupNum:number, teamId:TeamId, defaultLineups:Map<TeamId,Lineup>) {
        dispatch(setLineup({ lineupNum, lineup: defaultLineups.get(teamId) }));
    }
    function quizzerChanged(lineupNum:number, seatNum:number, quizzerId:QuizzerId) {
        dispatch(setLineupQuizzer({ lineupNum, seatNum, quizzerId }));
    }
    function captainChanged(lineupNum:number, captainId:QuizzerId) {
        dispatch(setLineupCaptain({ lineupNum, captainId }));
    }
    function coCaptainChanged(lineupNum:number, coCaptainId:QuizzerId) {
        dispatch(setLineupCoCaptain({ lineupNum, coCaptainId }));
    }
    function closeDialog() {
        dispatch(closePopup());
    }
    return { 
        teamChanged, quizzerChanged, captainChanged, coCaptainChanged, closeDialog
    }
}


export const LineupsPopup = connect(mapStateToProps, mapDispatchToProps)((props:LineupsPopupProps) => {
    const { lineups, showLineups, closeDialog } = props;
    return <Popup visible={ showLineups }>
        <div className={'lineups-popup'}>
            <div className={'flex-row'}>
            {
                [...new Array(3)]
                    .map((_,index) => lineups.get(index) || { } as Lineup)
                    .map((lineup,index) => <LineupSelection  {...props} key={index} lineupNum={index} lineup={lineup} />)
            }
            </div>
            <button onClick={ closeDialog }>Close</button>
        </div>
    </Popup>
});

const LineupSelection = (props:LineupsPopupProps & { lineup:Lineup, lineupNum:number}) => {
    const { lineup, teams, quizzers, defaultLineups, lineupNum } = props;
    const { teamChanged, quizzerChanged, captainChanged, coCaptainChanged } = props;
    const { } = props;
    const team = teams.get(lineup.teamId);
    return <div style={{flex:1}} className={'lineup-selection'}>
        <div>Team:</div>
        <select value={team?.id} onChange={ evt => teamChanged(lineupNum, evt.target.value, defaultLineups) } >
            <option value=''>--none--</option>
            { teams.toList().map(t=><option key={t.id} value={t.id}>{t.name}</option>) }
        </select>
        <div>Quizzers:</div>
        { 
            [...new Array(5)]
                .map((_,index) => quizzers.get(getIn(lineup, ['quizzerIds', index], '')))
                .map((quizzer,index) => <select value={quizzer?.id} key={index} onChange={ evt => quizzerChanged(lineupNum,index,evt.target.value)}>
                    <option value=''>--none--</option>
                    { quizzers.toList().map(q =><option key={q.id} value={q.id}>{q.name}</option>) }
                </select>)
        }
        <div>Captain:</div>
        <select value={lineup.captainId} onChange={ evt => captainChanged(lineupNum, evt.target.value) }>
            <option value=''>--none--</option>
            { (lineup.quizzerIds || [])
                .map(id => quizzers.get(id))
                .filter(quizzer => !!quizzer)
                .map(quizzer => <option key={quizzer.id} value={quizzer.id}>{quizzer.abbrName}</option> ) }
        </select>
        <div>Cocaption:</div>
        <select value={lineup.coCaptainId} onChange={ evt => coCaptainChanged(lineupNum, evt.target.value) }>
            <option value=''>--none--</option>
            { (lineup.quizzerIds || [])
                .map(id => quizzers.get(id))
                .filter(quizzer => !!quizzer)
                .map(quizzer => <option key={quizzer.id} value={quizzer.id}>{quizzer.abbrName}</option> ) }
        </select>
    </div>
}
