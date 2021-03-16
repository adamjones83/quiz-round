import * as React from "react";
import { TeamView } from "./TeamView";
import { connect } from "react-redux";
import { List } from 'immutable';
import { titleSelector, lineupsSelector, questionSelector } from '../redux/selectors';
import { Lineup } from '../data/types';
import { JumpInfoPopup } from "./JumpInfoPopup";

const mapStateToProps = state => ({
  title: titleSelector(state),
  lineups: lineupsSelector(state),
  question: questionSelector(state)
});
interface AppProps {
  title: string,
  lineups: List<Lineup>,
  question: number
}
export const App = connect(mapStateToProps)((props:AppProps) => {
  const { title, lineups, question } = props;
  return (
    <div>
      <JumpInfoPopup jumper={"Adam J"} />
      <div className={"app flex-column"}>
        <div className={"round-title flex-row"}>
          <div>{title}</div>
          <div style={{ textAlign: "right" }}>{`Question ${question}`}</div>
        </div>
        <div className={"teams flex-row"}>
          {
            lineups.slice(0,3)
              .map((lineup,index) => <TeamView key={lineup.teamId} lineup={lineup} lineupNum={index} />)
          }
        </div>
        <div className={"actions flex-row"}>
          <button>Ok</button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  );
});
