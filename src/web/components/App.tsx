import * as React from "react";
import { TeamView } from "./TeamView";
import { connect } from "react-redux";
import { List } from "immutable";
import {
    titleSelector,
    lineupsSelector,
    questionSelector,
    questionStateSelector
} from "../redux/selectors";
import { Lineup, QuestionState } from "../../types";
import { Dispatch } from "redux";
import { getAppUiActions } from "../ui-actions";
import { Popup } from './Popup';
import { Sounds } from "./Sounds";


const mapStateToProps = (state) => ({
    title: titleSelector(state),
    lineups: lineupsSelector(state),
    question: questionSelector(state),
    questionState: questionStateSelector(state)
});
interface AppProps {
    title: string;
    lineups: List<Lineup>;
    question: number;
    questionState: QuestionState;
    dispatch: Dispatch;
}
export const App = connect(mapStateToProps)((props: AppProps) => {
    const { title, lineups, question, questionState, dispatch } = props;
    const uiActions = getAppUiActions(dispatch, questionState);
    return (
        <div>
            <Popup />
            <Sounds />
            <div className={"app flex-column"}>
                <div className={"round-title flex-row"}>
                    <div>{title}</div>
                    <div
                        style={{ textAlign: "right" }}
                    >{`Question ${question}`}</div>
                </div>
                <div className={"teams flex-row"}>
                    {lineups.slice(0, 3)
                        .map((lineup, index) => ({ lineup, index }))
                        .filter(a => !!a.lineup?.teamId)
                        .map(({ lineup, index }) => (
                        <TeamView
                            key={index}
                            lineup={lineup}
                            lineupNum={index}
                        />
                    ))}
                </div>
                <div className={"actions flex-row"}>
                    {uiActions.map((a) => (
                        <button key={a.name} onClick={a.action}>
                            {a.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});
