import * as React from "react";
import { connect } from 'react-redux';
import { jumpedSelector, quizzersSelector, scoresSelector, seatsSelector } from "../redux/selectors";
import { Quizzer, Score, Seat, SeatId } from '../../types';
import { Set, Map, List } from 'immutable';

interface SeatViewProps {
    seatId:SeatId;
    quizzers: Map<string,Quizzer>;
    seats: Map<string,Seat>;
    jumped: Set<string>;
    scores: List<Score>;
}
const mapStateToProps = state => ({ 
    quizzers: quizzersSelector(state),
    seats: seatsSelector(state),
    jumped: jumpedSelector(state),
    scores: scoresSelector(state)
});

export const SeatView = connect(mapStateToProps)((props: SeatViewProps) => {
    const { seatId, jumped, seats, quizzers, scores } = props;
    const seat = seats.get(seatId);
    const { teamId, quizzerId, isEnabled } = seat;
    const name = quizzers.get(quizzerId)?.abbrName || seatId;
    const isJumped = jumped.has(seatId);
    const classes = ['seat'];
    if(isJumped) classes.push('jumped');
    if(!isEnabled) classes.push('disabled');
    return <div className={ classes.join(' ') } data-teamid={teamId} data-seatid={seatId} data-quizzerid={ quizzerId }>
        <div>
            <span>{ name }</span>
            <span>{ getCount(quizzerId, scores) }</span>
        </div>
    </div>;
});

function getCount(quizzerId:string, scores:List<Score>) {
    const correct = scores.count(a => a.quizzerId === quizzerId && a.type === 'correct');
    const errors = scores.count(a => a.quizzerId === quizzerId && a.type === 'error');
    return (correct + errors) ? ` - ${correct}/${errors}` : ''
}