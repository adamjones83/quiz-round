import { createAction } from '@reduxjs/toolkit';
import { JumpHandler } from '../jump-handler';
import { TimerHandler } from '../timer-handler';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { QuestionState, Team, Quizzer, Lineup } from '../../data/types';
import { Map, List } from 'immutable';

const SET_TIMER_HANDLER = 'SET_TIMER_HANDLER';
const SET_ROUND_TITLE = 'SET_ROUND_TITLE';
const UPDATE_QUESTION = 'UPDATE_QUESTION';
const UPDATE_QUESTION_STATE = 'UPDATE_QUESTION_STATE';
const UPDATE_TEAMS = 'UPDATE_TEAMS';
const UPDATE_QUIZZERS = 'UPDATE_QUIZZERS';
const UPDATE_LINEUPS = 'UPDATE_LINEUPS';

export const setTimerHandler = createAction<Dispatch>(SET_TIMER_HANDLER);
export const setRoundTitle = createAction<string>(SET_ROUND_TITLE);
export const updateQuestion = createAction<number>(UPDATE_QUESTION);
export const updateQuestionState = createAction<QuestionState>(UPDATE_QUESTION_STATE);
export const updateTeams = createAction<{ [teamId:string]:Team }>(UPDATE_TEAMS);
export const updateQuizzers = createAction<{ [quizzerId:string]:Quizzer }>(UPDATE_QUIZZERS);
export const updateLineups = createAction<Lineup[]>(UPDATE_LINEUPS);

export function addAdminActions(builder:ActionReducerMapBuilder<Map<string,unknown>>) {
    builder
        .addCase(setTimerHandler, (state,action) => state.set('timerHandler', TimerHandler(action.payload)))
        .addCase(setRoundTitle, (state, action) => state.set('title', action.payload))
        .addCase(updateQuestion, (state, action) => state.set('question', action.payload))
        .addCase(updateQuestionState, (state, action) => state.set('state', action.payload))
        .addCase(updateTeams, (state, action) => state.set('teams', Map(action.payload)))
        .addCase(updateQuizzers, (state, action) => state.set('quizzers', Map(action.payload)))
        .addCase(updateLineups, (state, action) => state.set('lineups', List(action.payload)))
}