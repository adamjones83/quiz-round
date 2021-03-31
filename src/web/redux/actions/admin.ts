import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { QuestionState, Team, Quizzer, Score, TeamId, Lineup, QuizzerId, ScoreType } from '../../../types';
import { Map, List, updateIn } from 'immutable';
import { RoundState } from '../reducer';
import { scorePartsSelecor } from '../selectors';
import { nanoid } from 'nanoid';
import { getDateStr, getDateTimeStr } from '../../utils';

const SET_ROUND_TITLE = 'SET_ROUND_TITLE';
const SET_QUESTION = 'SET_QUESTION';
const SET_QUESTION_STATE = 'SET_QUESTION_STATE';
const UPDATE_TEAMS = 'UPDATE_TEAMS';
const UPDATE_QUIZZERS = 'UPDATE_QUIZZERS';
const UPDATE_DEFAULT_LINEUPS = 'UPDATE_DEFAULT_LINEUPS';
const ADD_SCORE = 'ADD_SCORE';
const REMOVE_SCORE = 'REMOVE_SCORE';
const CHANGE_TEAM_NAME = 'CHANGE_TEAM_NAME';
const CHANGE_QUIZZER_NAME = 'CHANGE_QUIZZER_NAME';
const NEXT_QUESTION = 'NEXT_QUESTION';
const PREV_QUESTION = 'PREV_QUESTION';
const TOGGLE_SHOW_SCORES = 'TOGGLE_SHOW_SCORES';
       
export const setRoundTitle = createAction<string>(SET_ROUND_TITLE);
export const setQuestion = createAction<number>(SET_QUESTION);
export const setQuestionState = createAction<QuestionState>(SET_QUESTION_STATE);
export const updateTeams = createAction<Record<TeamId,Team>>(UPDATE_TEAMS);
export const updateQuizzers = createAction<Record<QuizzerId,Quizzer>>(UPDATE_QUIZZERS);
export const updateDefaultLineups = createAction<Record<TeamId,Lineup>>(UPDATE_DEFAULT_LINEUPS);
export const addScore = createAction<Partial<Score>>(ADD_SCORE);
export const removeScore = createAction<number>(REMOVE_SCORE);
export const changeTeamName = createAction<{ id:string, name:string }>(CHANGE_TEAM_NAME);
export const changeQuizzerName = createAction<{ id:string, name:string }>(CHANGE_QUIZZER_NAME);
export const nextQuestion = createAction(NEXT_QUESTION);
export const prevQuestion = createAction(PREV_QUESTION);
export const toggleShowScores = createAction(TOGGLE_SHOW_SCORES);

function toScore(info:Partial<Score>, state:RoundState):Score {
    const { roundId, meetId, question } = scorePartsSelecor(state);
    return {
        id: nanoid(),
        roundId, meetId, question,
        teamId:nanoid(),
        isTeamOnly:true,
        value: 0,
        type: '-unknown-',
        createdOn: getDateTimeStr(),
        ...info
    };
}
export function addAdminActions(builder:ActionReducerMapBuilder<Map<string,unknown>>) {
    builder
        .addCase(setRoundTitle, (state, action) => state.set('title', action.payload))
        .addCase(setQuestion, (state, action) => state.set('question', action.payload))
        .addCase(setQuestionState, (state, action) => state.set('questionState', action.payload))
        .addCase(updateTeams, (state, action) => state.set('teams', Map(action.payload)))
        .addCase(updateQuizzers, (state, action) => state.set('quizzers', Map(action.payload)))
        .addCase(updateDefaultLineups, (state, action) => state.set('defaultLineups', Map(action.payload)))
        .addCase(addScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => 
            list.push(toScore(action.payload,state as unknown as RoundState))))
        .addCase(removeScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => list.remove(action.payload)))
        .addCase(changeTeamName, (state, {payload: { id, name }}) => 
            updateIn(state, ['teams'], (map:Map<string,Team>) => map.update(id, team => ({ ...team, name }))))
        .addCase(changeQuizzerName, (state, {payload: { id, name }}) => 
            updateIn(state, ['quizzers'], (map:Map<string,Quizzer>) => map.update(id, quizzer => ({ ...quizzer, name }))))
        .addCase(nextQuestion, state => state.set('question', state.get('question') as number + 1))
        .addCase(prevQuestion, state => state.set('question', Math.max(1, state.get('question') as number - 1)))
        .addCase(toggleShowScores, state => updateIn(state, ['showScores'], value => !value))
}