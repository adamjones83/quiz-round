import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { QuestionState, Team, Quizzer, Score } from '../../data/types';
import { Map, List, updateIn } from 'immutable';

const SET_ROUND_TITLE = 'SET_ROUND_TITLE';
const UPDATE_QUESTION = 'UPDATE_QUESTION';
const UPDATE_QUESTION_STATE = 'UPDATE_QUESTION_STATE';
const UPDATE_TEAMS = 'UPDATE_TEAMS';
const UPDATE_QUIZZERS = 'UPDATE_QUIZZERS';
const ADD_SCORE = 'ADD_SCORE';
const REMOVE_SCORE = 'REMOVE_SCORE';
const CHANGE_TEAM_NAME = 'CHANGE_TEAM_NAME';
const CHANGE_QUIZZER_NAME = 'CHANGE_QUIZZER_NAME';
const NEXT_QUESTION = 'NEXT_QUESTION';
const PREV_QUESTION = 'PREV_QUESTION';
       
export const setRoundTitle = createAction<string>(SET_ROUND_TITLE);
export const updateQuestion = createAction<number>(UPDATE_QUESTION);
export const updateQuestionState = createAction<QuestionState>(UPDATE_QUESTION_STATE);
export const updateTeams = createAction<{ [teamId:string]:Team }>(UPDATE_TEAMS);
export const updateQuizzers = createAction<{ [quizzerId:string]:Quizzer }>(UPDATE_QUIZZERS);
export const addScore = createAction<Score>(ADD_SCORE);
export const removeScore = createAction<number>(REMOVE_SCORE);
export const changeTeamName = createAction<{ id:string, name:string }>(CHANGE_TEAM_NAME);
export const changeQuizzerName = createAction<{ id:string, name:string }>(CHANGE_QUIZZER_NAME);
export const nextQuestion = createAction(NEXT_QUESTION);
export const prevQuestion = createAction(PREV_QUESTION);

export function addAdminActions(builder:ActionReducerMapBuilder<Map<string,unknown>>) {
    builder
        .addCase(setRoundTitle, (state, action) => state.set('title', action.payload))
        .addCase(updateQuestion, (state, action) => state.set('question', action.payload))
        .addCase(updateQuestionState, (state, action) => state.set('questionState', action.payload))
        .addCase(updateTeams, (state, action) => state.set('teams', Map(action.payload)))
        .addCase(updateQuizzers, (state, action) => state.set('quizzers', Map(action.payload)))
        .addCase(addScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => list.push(action.payload)))
        .addCase(removeScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => list.remove(action.payload)))
        .addCase(changeTeamName, (state, {payload: { id, name }}) => 
            updateIn(state, ['teams'], (map:Map<string,Team>) => map.update(id, team => ({ ...team, name }))))
        .addCase(changeQuizzerName, (state, {payload: { id, name }}) => 
            updateIn(state, ['quizzers'], (map:Map<string,Quizzer>) => map.update(id, quizzer => ({ ...quizzer, name }))))
        .addCase(nextQuestion, state => state.set('question', state.get('question') as number + 1))
        .addCase(prevQuestion, state => state.set('question', Math.max(1, state.get('question') as number - 1)))
}