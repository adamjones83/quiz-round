import { AnyAction, createAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
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
        if(bonus) scores.push(toScore(state,{teamId,quizzerId,value:correct?10:0,type:correct?'bonus-correct':'bonus-error',isTeamOnly:true}))
        else {
            if(correct) {
                scores.push(toScore(state,{teamId,quizzerId,value:20,type:'correct',isTeamOnly:false}));
            } else {
                scores.push(toScore(state,{teamId,quizzerId,value:0,type:'error',isTeamOnly:false}));
            }
        }
        return scores;
    });
}


const normalOrder = (a:Score,b:Score) => `${a.question}:${a.type}`.localeCompare(`${b.question}:${b.type}`);
const byTeam = (teamId:string) => (score:Score) => score.teamId === teamId;
const byQuizzer = (quizzerId:string) => (score:Score) => score.quizzerId === quizzerId;
const isCorrect = (score:Score) => score.type === 'correct';
const isError = (score:Score) => score.type === 'error';

const bonusTypes = [
    'quizout /wo error', // quizout without error
    '3rd person bonus',
    '4th person bonus',
    '5th person bonus',
    '5+ team error',
    'error after 15',
    'error-out',
    '2nd foul',
    '2nd overruled challenge'
];
/** get a set of score stats useful for calculating bonus points */
function getScoreStats(scores:List<Score>, score:Score) {
    const { question, teamId, quizzerId } = score;
    const fromTeam = scores.filter(byTeam(teamId));
    const fromQuizzer = scores.filter(byQuizzer(quizzerId));
    const quizzerCorrect = fromQuizzer.count(isCorrect);
    const quizzerError = fromQuizzer.count(isCorrect);
    const teamQuizzersCorrect = fromTeam
        .filter(isCorrect)
        .map(a => a.quizzerId)
        .toSet().size;
    const teamErrors = fromTeam
        .count(isError);
    const after15 = question >= 15;
    const teamFouls = fromTeam.count(a => a.type === 'foul');
    const teamOverruledChallenges = fromTeam.count(a => a.type === 'overruled-challenge');
    return { quizzerCorrect, quizzerError, teamQuizzersCorrect, teamErrors, after15, teamFouls, teamOverruledChallenges };
}
/** get an updated score list with bonuses recalculated */
function recalcBonuses(state:RoundState, scores:List<Score>) {
    const bonuses:Score[] = [];
    const withoutBonuses = scores.filter(a => !bonusTypes.includes(a.type));

    // goes question by question and adds bonuses with the question number at which they occurred
    withoutBonuses
        .sort(normalOrder)
        .forEach((score,_,all) => {
        const { teamId, quizzerId, question } = score;
        const { quizzerCorrect, quizzerError, teamQuizzersCorrect, teamErrors, 
            after15, teamFouls, teamOverruledChallenges } = getScoreStats(all, score)
        switch(score.type) {
            case 'correct':
                if(quizzerCorrect === 3 && !quizzerError)
                    bonuses.push(toScore(state, { question, teamId, quizzerId, value: 10, type: 'quizout /wo error', isTeamOnly:false }));
                if(quizzerCorrect === 0) {
                    const type = ['3rd person bonus', '4th person bonus', '5th person bonus'][teamQuizzersCorrect-2] as ScoreType;
                    if(type) {
                        bonuses.push(toScore(state, { question, teamId, quizzerId, value: 10, type, isTeamOnly:true }));
                    }
                }
                break;
            case 'error':
                if(quizzerError === 2)
                    bonuses.push(toScore(state, { question, teamId, quizzerId, value: -10, type: 'error-out', isTeamOnly:false }));
                else if(after15)
                    bonuses.push(toScore(state, { question, teamId, quizzerId, value: -10, type: 'error after 15', isTeamOnly:true }));
                else if(teamErrors >= 4)
                    bonuses.push(toScore(state, { question, teamId, quizzerId, value: -10, type: '5+ team error', isTeamOnly:true }));
                break;
            case 'foul':
                if(teamFouls % 2 === 1)
                    bonuses.push(toScore(state, { question, teamId, quizzerId, value: -10, type: '2nd foul', isTeamOnly:true }));
                break;
            case 'overruled-challenge':
                if(teamOverruledChallenges % 2 === 1)
                    bonuses.push(toScore(state, { question, teamId, quizzerId, value: -10, type: 'overruled-challenge', isTeamOnly:true }));
                break;
            default:
                break;
        }
    });
    return withoutBonuses.push(...bonuses).sort(normalOrder);
}

export function addScoresActions(builder:ActionReducerMapBuilder<Map<string,unknown>>):void {
    builder
        .addCase(addScores, (state, {payload}) => {
            const _state = state as unknown as RoundState;
            const scores = payload(_state);
            return updateIn(_state, ['scores'], (list:List<Score>) => recalcBonuses(_state, list.push(...scores)));
        })
        .addCase(removeScore, (state, action) => {
            const _state = state as unknown as RoundState;
            return updateIn(state, ['scores'], (list:List<Score>) => recalcBonuses(_state, list.remove(action.payload)));
        });
}