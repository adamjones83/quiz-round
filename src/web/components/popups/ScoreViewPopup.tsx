import * as React from "react";
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Quizzer, Score, Team } from '../../../types';
import { RoundState } from "../../redux/reducer";
import { quizzersSelector, scoresSelector, showPopupSelector, teamsSelector } from "../../redux/selectors";
import { Dispatch } from "redux";
import { closePopup, removeScore } from "../../redux/actions";

interface ScoreViewPopupProps {
    scores: List<Score>,
    teams: Map<string, Team>,
    quizzers: Map<string, Quizzer>,
    dispatch: Dispatch
}
const mapStateToProps = (state: RoundState) => ({
    scores: scoresSelector(state),
    teams: teamsSelector(state),
    quizzers: quizzersSelector(state)
});

export const ScoreViewPopup = connect(mapStateToProps)((props: ScoreViewPopupProps) => {
    const { teams, quizzers, scores, dispatch } = props;
    return <div className={'score-popup'}>
        <table><thead>
            <tr>
                <th>Q#</th>
                <th>Team</th>
                <th>Quizzer</th>
                <th>Type</th>
                <th>Value</th>
                <th>&nbsp;</th>
            </tr>
        </thead><tbody>
                {scores.map((score, index) => {
                    const team = teams.get(score.teamId)?.name;
                    const quizzer = quizzers.get(score.quizzerId)?.name;
                    return <tr key={score.id}>
                        <td>{score.question}</td>
                        <td>{team}</td>
                        <td>{quizzer}</td>
                        <td>{score.type}</td>
                        <td>{score.value}</td>
                        <td><button onClick={() => dispatch(removeScore(index))} >Delete</button></td>
                    </tr>
                })}
            </tbody></table>
        <button style={{ flex: 1 }} onClick={() => dispatch(closePopup())}>Close</button>
    </div>
});
