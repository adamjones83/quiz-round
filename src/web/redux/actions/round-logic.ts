import { createAction, ActionReducerMapBuilder, nanoid } from '@reduxjs/toolkit';
import { List, updateIn } from 'immutable';
import { RoundState } from '../reducer';
import { Score, TeamId, QuizzerId } from '../../../types';
import { meetIdSelector, questionSelector, roundIdSelector } from '../selectors';

export interface AnsweredInfo {
    teamId:TeamId,
    quizzerId:QuizzerId,
    correct:boolean
}

export const answering = createAction('ANSWERING');
export const cancelAnswer = createAction('CANCEL_ANSWER');
export const answered = createAction<AnsweredInfo[]>('ANSWERED');
export const bonusAnswered = createAction<AnsweredInfo[]>('BONUS_ANSWERED');

export function addRoundLogicActions(builder:ActionReducerMapBuilder<RoundState>):void {
    builder
        .addCase(answering, state => updateIn(state, ['questionState'], value => value == 'jumpset' ? 'answer' : value))
        .addCase(cancelAnswer, state => updateIn(state, ['questionState'], () => 'before'))
        .addCase(answered, (state,action) => {
            const _state = state as unknown as RoundState;
            const question = questionSelector(_state);
            const roundId = roundIdSelector(_state);
            const meetId = meetIdSelector(_state);
            const doBonus = action.payload.every(a => !a.correct);
            return action.payload.reduce((newState, { teamId, quizzerId, correct }) => {
                return newState.update('scores', value => (value as List<Score>).push({
                    id: nanoid(), roundId, meetId,
                    question, teamId, quizzerId, isTeamOnly: false,
                    value: correct ? 20 : 0, type: correct ? 'correct' : 'error',
                    createdOn: new Date().toISOString()
                }));
            }, state as unknown as RoundState)
                .set('question', doBonus ? question : question + 1)
                .set('questionState', doBonus ? 'bonus': 'before');
        })
        .addCase(bonusAnswered, (state,action) => {
            const _state = state as unknown as RoundState;
            const question = questionSelector(_state);
            const roundId = roundIdSelector(_state);
            const meetId = meetIdSelector(_state);
            return action.payload.reduce((newState, { teamId, quizzerId, correct }) => {
                
                return newState.update('scores', value => (value as List<Score>).push({
                    id: nanoid(), roundId, meetId,
                    question, teamId, quizzerId, isTeamOnly: true,
                    value: correct ? 10 : 0, type: correct ? 'bonus-correct' : 'bonus-error',
                    createdOn: new Date().toISOString()
                }));
            }, state as unknown as RoundState)
                .set('question', question + 1)
                .set('questionState', 'before');
        });
}
