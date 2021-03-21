import * as React from "react";
import { connect } from 'react-redux';
import { jumpedSelector, quizzersSelector, seatsSelector } from "../redux/selectors";
import { Quizzer, Seat, SeatId } from '../data/types';
import { Set, Map } from 'immutable';

interface SeatViewProps {
    seatId:SeatId;
    quizzers: Map<string,Quizzer>;
    seats: Map<string,Seat>;
    jumped: Set<string>;
}
const mapStateToProps = state => ({ 
    quizzers: quizzersSelector(state),
    seats: seatsSelector(state),
    jumped: jumpedSelector(state)
});

export const SeatView = connect(mapStateToProps)((props: SeatViewProps) => {
    const { seatId, jumped, seats, quizzers } = props;
    const seat = seats.get(seatId);
    const { teamId, quizzerId, isEnabled } = seat;
    const name = quizzers.get(quizzerId)?.abbrName || seatId;
    const isJumped = jumped.has(seatId);
    const classes = ['seat'];
    if(isJumped) classes.push('jumped');
    if(!isEnabled) classes.push('disabled');
    return <div className={ classes.join(' ') } data-teamid={teamId} data-seatid={seatId} data-quizzerid={ quizzerId }>
        <div>{ name }</div>
    </div>;
});
