import * as React from "react";
import { Popup } from "./Popup"
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Quizzer, Score, Team } from '../../types';
import { RoundState } from "../redux/reducer";
import { quizzersSelector, scoresSelector, teamsSelector } from "../redux/selectors";

interface ScoreViewPopupProps {
    showScores: boolean,
    scores: List<Score>,
    teams: Map<string,Team>,
    quizzers: Map<string,Quizzer>
}
const mapStateToProps = (state:RoundState) => ({
    scores: scoresSelector(state),
    showScores: !!state.get('showScores'),
    teams: teamsSelector(state),
    quizzers: quizzersSelector(state)
});

export const ScoreViewPopup = connect(mapStateToProps)((props:ScoreViewPopupProps) => <Popup visible={ props.showScores }>
    <div className={'score-popup'}>
        {
            props.scores.map((score,index) => <div key={index}>
                { getScoreString(score, props.teams, props.quizzers) }
            </div>)
        }
        <button style={{flex:1}}>Close</button>
    </div>
</Popup>);

function getScoreString(score:Score, teams: Map<string,Team>, quizzers: Map<string,Quizzer>) {
    const team = teams.get(score.teamId);
    const quizzer = quizzers.get(score.quizzerId);
    return `Question ${score.question} - ${quizzer && quizzer.name}(${team.name}): ${score.value}pts - ${score.type}`;
}