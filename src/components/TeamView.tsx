import * as React from "react";
import { connect } from 'react-redux';
import { teamScoreSelector, teamsSelector } from "../redux/selectors";
import { SeatView } from "./SeatView";
import { Map } from 'immutable';
import { Lineup, Team } from '../data/types';
import { getSeatId } from "../redux/actions";

interface TeamViewProps {
  lineupNum:number;
  lineup: Lineup;
  teams:Map<string,Team>;
  teamScores: { [teamId:string]:number };
}
const mapStateToProps = state => ({
  teams: teamsSelector(state),
  teamScores: teamScoreSelector(state)
});
export const TeamView = connect(mapStateToProps)((props: TeamViewProps) => {
  const { lineupNum, lineup, teams, teamScores } = props;
  const team = teams.get(lineup.teamId);
  const score = teamScores[lineup.teamId];
  return (
    <div className={"team flex-column"} style={{ backgroundColor: lineup.color }}>
      <div className={"team-name"}>
        <div>{team.name}</div>
      </div>
      <div className={"team-score"}>{score}</div>
      <div className={"quizzers flex-column"}>
        { [...new Array(5)].map((_,i) => <SeatView key={i} seatId={getSeatId(lineupNum,i)} />) }
      </div>
    </div>
  );
});
