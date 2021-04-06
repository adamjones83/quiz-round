import { AnyAction, createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Map, List, updateIn } from 'immutable';
import { nanoid } from 'nanoid';
import { QuizzerId, Score, ScoreType, TeamId } from '../../../types';
import { getDateTimeStr } from '../../utils';
import { RoundState } from '../reducer';
import { scorePartsSelector, scoresSelector } from '../selectors';

function toScore(state:RoundState, info:Partial<Score>):Score {
    const { roundId, meetId, question } = scorePartsSelector(state);
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

export const addScores = createAction<(state:RoundState)=>Score[]>('ADD_SCORES');
export const removeScore = createAction<number>('REMOVE_SCORE');

export const addTimeout = (teamId:TeamId):AnyAction => {
    return addScores(state => [toScore(state,{teamId,type:'timeout'})]);
}
export const addFoul = (teamId:TeamId,quizzerId?:QuizzerId):AnyAction => {
    return addScores(state => {
        // if current scores have an odd number of fouls, adding another makes it even
        const current = scoresSelector(state);
        const isEven = current.count(a => a.type === 'foul') % 2 === 1;
        const scores = [toScore(state,{teamId,quizzerId,type:'foul'})];
        if(isEven) scores.push(toScore(state,{teamId,type:'2nd foul'}));
        return scores;
    })
}
export const addChallenge = (teamId:TeamId,quizzerId:QuizzerId,upheld:boolean):AnyAction => {
    return addScores(state => {
        const type:ScoreType = upheld ? 'upheld-challenge':'overruled-challenge';
        console.warn('not adding penalty for 2nd overruled challenge');
        return [toScore(state, {teamId,quizzerId,type})];
    });
}
export const addAppeal = (teamId:TeamId,quizzerId:QuizzerId,upheld:boolean):AnyAction => {
    return addScores(state => {
        const type:ScoreType = upheld ? 'upheld-appeal':'overruled-appeal';
        return [toScore(state, {teamId,quizzerId,type})];
    });
}
export const addAnswered = (teamId:TeamId,quizzerId:QuizzerId,correct:boolean,bonus:boolean):AnyAction => {
    return addScores(state => {
        const scores:Score[] = [];
        if(bonus) scores.push(toScore(state,{teamId,quizzerId,value:correct?10:0,type:correct?'bonus-correct':'bonus-error'}))
        else {
            // correct, quiz out, nth person bonus, error, error out, 5th team error, error after 15
            console.warn('not adding score items for quiz-out, nth person bonus, error out, 5th team error, or error after 15');
            if(correct) {
                scores.push(toScore(state,{teamId,quizzerId,value:20,type:'correct'}));
            } else {
                scores.push(toScore(state,{teamId,quizzerId,value:0,type:'error'}));
            }
        }
        return scores;
    });
}

export function addScoresActions(builder:ActionReducerMapBuilder<Map<string,unknown>>):void {
    builder
        .addCase(addScores, (state, {payload}) => {
            const _state = state as unknown as RoundState;
            const scores = payload(_state);
            return updateIn(_state, ['scores'], (list:List<Score>) => list.push(...scores));
        })
        .addCase(removeScore, (state, action) => updateIn(state, ['scores'], (list:List<Score>) => list.remove(action.payload)))
}