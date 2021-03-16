import { QuestionState, Team, Quizzer, Lineup, Seat, Score } from '../data/types';
import { Map, List } from 'immutable';
import { createSelector } from '@reduxjs/toolkit';

export const titleSelector = state => state.get('title') as string;
export const questionSelector = state => state.get('question') as number;
export const questionStateSelector = state => state.get('state') as QuestionState;
export const teamsSelector = state => state.get('teams') as Map<string, Team>;
export const quizzersSelector = state => state.get('quizzers') as Map<string, Quizzer>;
export const lineupsSelector = state => state.get('lineups') as List<Lineup>;
export const disabledSeatsSelector = state => state.get('disabledSeats') as Set<string>;
export const scoresSelector = state => state.get('scores') as List<Score>;
export const jumpedSelector = state => state.get('jumped') as Set<string>;
export const timerNameSelector = state => state.get('timerName') as string;
export const timeLeftSelector = state => state.get('timeLeft') as number;

/* COMPOUND CUSTOM SELECTORS */
export const teamScoreSelector = createSelector(scoresSelector, teamsSelector,
    (scores, teams) => teams.reduce((lookup,team) => {
        lookup[team.id] = getTeamScore(scores.toArray(), team.id);
        return lookup;
    }, { } as { [teamId:string]:number })
);
export const quizzerScoreSelector = createSelector(scoresSelector, quizzersSelector,
    (scores, quizzers) => quizzers.reduce((lookup,quizzer) => {
        lookup[quizzer.id] = getQuizzerScore(scores.toArray(), quizzer.id);
        return lookup;
    }, { } as { [quizzerId:string]:number })
);

function getTeamScore(scores:Score[], teamId:string) {
    return scores
        .filter(a => a.teamId === teamId)
        .reduce((ac,item) => ac + (item.value || 0), 0);
}
function getQuizzerScore(scores:Score[], quizzerId:string) {
    return scores
        .filter(a => a.quizzerId === quizzerId && !a.isTeamOnly)
        .reduce((ac,item) => ac + (item.value || 0), 0);
}