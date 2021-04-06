import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { QuestionState, Team, Quizzer, TeamId, Lineup, QuizzerId, PopupType } from '../../../types';
import { Map, updateIn } from 'immutable';

const SET_ROUND_TITLE = 'SET_ROUND_TITLE';
const SET_QUESTION = 'SET_QUESTION';
const SET_QUESTION_STATE = 'SET_QUESTION_STATE';
const UPDATE_TEAMS = 'UPDATE_TEAMS';
const UPDATE_QUIZZERS = 'UPDATE_QUIZZERS';
const UPDATE_DEFAULT_LINEUPS = 'UPDATE_DEFAULT_LINEUPS';
const CHANGE_TEAM_NAME = 'CHANGE_TEAM_NAME';
const CHANGE_QUIZZER_NAME = 'CHANGE_QUIZZER_NAME';
const NEXT_QUESTION = 'NEXT_QUESTION';
const PREV_QUESTION = 'PREV_QUESTION';
const SHOW_POPUP = 'SHOW_POPUP';
const CLOSE_POPUP = 'CLOSE_POPUP';

export const setRoundTitle = createAction<string>(SET_ROUND_TITLE);
export const setQuestion = createAction<number>(SET_QUESTION);
export const setQuestionState = createAction<QuestionState>(SET_QUESTION_STATE);
export const updateTeams = createAction<Record<TeamId,Team>>(UPDATE_TEAMS);
export const updateQuizzers = createAction<Record<QuizzerId,Quizzer>>(UPDATE_QUIZZERS);
export const updateDefaultLineups = createAction<Record<TeamId,Lineup>>(UPDATE_DEFAULT_LINEUPS);
export const changeTeamName = createAction<{ id:string, name:string }>(CHANGE_TEAM_NAME);
export const changeQuizzerName = createAction<{ id:string, name:string }>(CHANGE_QUIZZER_NAME);
export const nextQuestion = createAction(NEXT_QUESTION);
export const prevQuestion = createAction(PREV_QUESTION);
export const showPopup = createAction<PopupType>(SHOW_POPUP);
export const closePopup = createAction(CLOSE_POPUP);

export function addAdminActions(builder:ActionReducerMapBuilder<Map<string,unknown>>):void {
    builder
        .addCase(setRoundTitle, (state, action) => state.set('title', action.payload))
        .addCase(setQuestion, (state, action) => state.set('question', action.payload))
        .addCase(setQuestionState, (state, action) => state.set('questionState', action.payload))
        .addCase(updateTeams, (state, action) => state.set('teams', Map(action.payload)))
        .addCase(updateQuizzers, (state, action) => state.set('quizzers', Map(action.payload)))
        .addCase(updateDefaultLineups, (state, action) => state.set('defaultLineups', Map(action.payload)))
        .addCase(changeTeamName, (state, {payload: { id, name }}) => 
            updateIn(state, ['teams'], (map:Map<string,Team>) => map.update(id, team => ({ ...team, name }))))
        .addCase(changeQuizzerName, (state, {payload: { id, name }}) => 
            updateIn(state, ['quizzers'], (map:Map<string,Quizzer>) => map.update(id, quizzer => ({ ...quizzer, name }))))
        .addCase(nextQuestion, state => state.set('question', state.get('question') as number + 1))
        .addCase(prevQuestion, state => state.set('question', Math.max(1, state.get('question') as number - 1)))
        .addCase(showPopup, (state,action) => updateIn(state, ['showPopup'], value => value !== 'none' ? value : action.payload))
        .addCase(closePopup, state => state.set('showPopup', 'none'))
}