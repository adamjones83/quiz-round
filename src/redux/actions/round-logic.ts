import { createAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { List, updateIn } from 'immutable';
import { RoundState } from '../reducer';
import { Score, TeamId, QuizzerId } from '../../data/types';
import { questionSelector } from '../selectors';

interface AnsweredInfo {
    teamId:TeamId,
    quizzerId:QuizzerId,
    correct:boolean
}

export const answering = createAction('ANSWERING');
export const cancelAnswer = createAction('CANCEL_ANSWER');
export const answered = createAction<AnsweredInfo[]>('ANSWERED');
export const bonusAnswered = createAction<AnsweredInfo[]>('BONUS_ANSWERED');
export function addRoundLogicActions(builder:ActionReducerMapBuilder<RoundState>) {
    // TODO: add state change to set seats of bonus answerers
    // TODO: add state change for extra bonus scores
    const bonuses = ['quiz out', 'error out', 'nth team error', 'nth person bonus', 'error after 15'];
    console.warn('not yet handling bonus scores', bonuses);
    
    builder
        .addCase(answering, state => updateIn(state, ['questionState'], value => value == 'jumpset' ? 'answer' : value))
        .addCase(cancelAnswer, state => updateIn(state, ['questionState'], () => 'before'))
        .addCase(answered, (state,action) => {
            const question = questionSelector(state);
            const doBonus = action.payload.every(a => !a.correct);
            return action.payload.reduce((newState, { teamId, quizzerId, correct }) => {
                return newState.update('scores', value => (value as List<Score>).push({
                    question, teamId, quizzerId, isTeamOnly: false,
                    value: correct ? 20 : 0, type: correct ? 'correct' : 'error'
                }));
            }, state as unknown as RoundState)
                .set('question', doBonus ? question : question + 1)
                .set('questionState', doBonus ? 'bonus': 'before');
        })
        .addCase(bonusAnswered, (state,action) => {
            const question = questionSelector(state);
            return action.payload.reduce((newState, { teamId, quizzerId, correct }) => {
                return newState.update('scores', value => (value as List<Score>).push({
                    question, teamId, quizzerId, isTeamOnly: true,
                    value: correct ? 10 : 0, type: correct ? 'bonus-correct' : 'bonus-error'
                }));
            }, state as unknown as RoundState)
                .set('question', question + 1)
                .set('questionState', 'before');
        })
}
