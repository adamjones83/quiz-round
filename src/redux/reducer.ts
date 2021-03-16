import { Map, List, Set } from 'immutable';
import { ActionReducerMapBuilder, createReducer } from '@reduxjs/toolkit';
import { addAdminActions, addSeatActions, addOtherActions } from './actions';

export const defaultState = Map({
    title: 'Quiz Round 1',
    question: 1,
    state: 'before',
    teams: Map(),
    quizzers: Map(),
    lineups: List(),
    disabledSeats: Set(),
    scores: List(),
    isLatched: false,
    jumpHandler: null,
    timerHandler: null,
    jumped: Set(), // seat ids
    timerName: '',
    timeLeft: 0
});

export const reducer = createReducer(defaultState, (builder:ActionReducerMapBuilder<Map<string,unknown>>) => {
    addAdminActions(builder);
    addSeatActions(builder);
    addOtherActions(builder);
    builder.addDefaultCase((state, action) => {
        console.warn("No reducer matching the dispatched action", action);
        return state;
    });
});
