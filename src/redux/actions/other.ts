import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Map, List, updateIn } from 'immutable';
import { Team, Quizzer, Score } from '../../data/types';

const ADD_SCORE = 'ADD_SCORE';
const REMOVE_SCORE = 'REMOVE_SCORE';
const TIMER_CHANGED = 'TIMER_CHANGED';
const TIMER_COMPLETED = 'TIMER_COMPLETED';
const CHANGE_TEAM_NAME = 'CHANGE_TEAM_NAME';
const CHANGE_QUIZZER_NAME = 'CHANGE_QUIZZER_NAME';
const NEXT_QUESTION = 'NEXT_QUESTION';
const PREV_QUESTION = 'PREV_QUESTION';

export interface TimerChangedInfo {
    name:string,
    timeLeft:number // seconds
}
export interface JumpChangedInfo {
    isLatched:boolean,
    jumped:string[]
}

export const addScore = createAction<Score>(ADD_SCORE);
export const removeScore = createAction<number>(REMOVE_SCORE);
export const timerChanged = createAction<TimerChangedInfo>(TIMER_CHANGED);
export const timerCompleted = createAction(TIMER_COMPLETED);
export const changeTeamName = createAction<{ id:string, name:string }>(CHANGE_TEAM_NAME);
export const changeQuizzerName = createAction<{ id:string, name:string }>(CHANGE_QUIZZER_NAME);
export const nextQuestion = createAction(NEXT_QUESTION);
export const prevQuestion = createAction(PREV_QUESTION);

export function addOtherActions(builder:ActionReducerMapBuilder<Map<string,unknown>>) {
    builder
        .addCase(addScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => list.push(action.payload)))
        .addCase(removeScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => list.remove(action.payload)))
        .addCase(timerChanged, (state, action) => state
            .set('timerName', action.payload.name)
            .set('timeLeft', action.payload.timeLeft))
        .addCase(changeTeamName, (state, {payload: { id, name }}) => 
            updateIn(state, ['teams'], (map:Map<string,Team>) => map.update(id, team => ({ ...team, name }))))
        .addCase(changeQuizzerName, (state, {payload: { id, name }}) => 
            updateIn(state, ['quizzers'], (map:Map<string,Quizzer>) => map.update(id, quizzer => ({ ...quizzer, name }))))
        .addCase(nextQuestion, state => state.set('question', state.get('question') as number + 1))
        .addCase(prevQuestion, state => state.set('question', Math.max(1, state.get('question') as number - 1)))
}