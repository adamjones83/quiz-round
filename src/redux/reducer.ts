import { Map, List, Set } from 'immutable';
import { Action} from 'redux';
import { ActionReducerMapBuilder, createReducer } from '@reduxjs/toolkit';
import { addAdminActions, addSeatActions, addTimerActions, TimerHandler, addJumpActions, JumpHandler } from './actions';
import { Team, Quizzer, Lineup, Seat, Score, QuizzerId, SeatId, TeamId } from '../data/types';
import { addRoundLogicActions } from './actions/round-logic';

export const defaultState = Map({
    title: 'Quiz Round 1',
    question: 1,
    questionState: 'before',
    teams: Map<TeamId,Team>(), 
    quizzers: Map<QuizzerId,Quizzer>(),
    lineups: List<Lineup>(),
    seats: Map<SeatId,Seat>(),
    scores: List<Score>(),
    isLatched: false,
    jumpHandler: undefined as JumpHandler,
    timerHandler: undefined as TimerHandler,
    jumped: Set<SeatId>(),
    timerName: '',
    timeLeft: 0
});
export type RoundState = typeof defaultState;

export const reducer = createReducer(defaultState, (builder:ActionReducerMapBuilder<RoundState>) => {
    addAdminActions(builder);
    addJumpActions(builder);
    addTimerActions(builder);
    addSeatActions(builder);
    addRoundLogicActions(builder);
    builder.addDefaultCase(defaultWarnHandler);
});

/** warn via the console on unmatched actions */
function defaultWarnHandler<T>(state:T,action:Action<string>) {
    if(!action.type.startsWith('@@redux/INIT'))
        console.warn("No reducer matching the dispatched action", action);
    return state;
}