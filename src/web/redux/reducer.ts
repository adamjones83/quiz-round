import { Map, List, Set } from 'immutable';
import { Action} from 'redux';
import { ActionReducerMapBuilder, createReducer, nanoid } from '@reduxjs/toolkit';
import { addAdminActions, addSeatActions, addHandlerActions, 
    addRoundLogicActions, addScoresActions  } from './actions';
import { Team, Quizzer, Lineup, Seat, Score, 
    QuizzerId, SeatId, TeamId, SeatMap, QuestionState, PopupType } from '../../types';
import { TeamColor } from '../colors';

export const defaultState = Map({
    roundId: nanoid(),
    meetId: nanoid(),
    title: 'Quiz Round 1',
    question: 1,
    questionState: 'before' as QuestionState,
    teams: Map<TeamId,Team>(), 
    quizzers: Map<QuizzerId,Quizzer>(),
    defaultLineups: Map<TeamId,Lineup>(),
    colors: List<string>([TeamColor.blue, TeamColor.green, TeamColor.red]),
    lineups: List<Lineup>(),
    seats: Map<SeatId,Seat>(),
    bonusSeatMaps: List<SeatMap>(),
    scores: List<Score>(),
    isLatched: false,
    jumped: Set<SeatId>(),
    timerName: '',
    timeLeft: 0,
    showPopup: 'none' as PopupType
});
export type RoundState = typeof defaultState;

export const reducer = createReducer(defaultState, (builder:ActionReducerMapBuilder<RoundState>) => {
    addAdminActions(builder);
    addHandlerActions(builder);
    addSeatActions(builder);
    addRoundLogicActions(builder);
    addScoresActions(builder);
    builder.addDefaultCase(defaultWarnHandler);
});

/** warn via the console on unmatched actions */
function defaultWarnHandler<T>(state:T,action:Action<string>) {
    if(!action.type.startsWith('@@redux/INIT'))
        console.warn("No reducer matching the dispatched action", action);
    return state;
}