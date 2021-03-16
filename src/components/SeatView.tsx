import * as React from "react";
import { connect } from 'react-redux';
import { disabledSeatsSelector, jumpedSelector, lineupsSelector, quizzersSelector } from "../redux/selectors";
import { Quizzer, Lineup } from '../data/types';
import { Map,List } from 'immutable';

interface SeatViewProps {
  seatNum:number;
  lineupNum:number;
  lineup: Lineup;
  teamId: string;
  quizzers: Map<string,Quizzer>;
  jumped: Set<string>;
  disabled: Set<string>;
}
const mapStateToProps = state => ({ 
  quizzers: quizzersSelector(state),
  jumped: jumpedSelector(state),
  disabled: disabledSeatsSelector(state)
});

export const SeatView = connect(mapStateToProps)((props: SeatViewProps) => {
    const { seatNum, lineupNum, lineup, teamId, quizzers, jumped, disabled } = props;
    const seatId = `Team ${lineupNum} - Seat ${seatNum}`;
    const quizzerId = lineup.quizzerIds[seatNum];
    const name = quizzers.get(quizzerId)?.abbrName || seatId;
    const isJumped = jumped.has(seatId);
    const isEnabled = !disabled.has(seatId);
    const classes = ['seat'];
    if(isJumped) classes.push('jumped');
    if(!isEnabled) classes.push('disabled');
    return <div className={ classes.join(' ') } data-teamid={teamId} data-seatid={seatId} data-quizzerid={ quizzerId }>
        <div>{ name }</div>
    </div>;
});
