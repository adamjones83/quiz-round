import { QuestionState, Team, Quizzer, Lineup, Seat, Score, TeamId, QuizzerId, SeatId } from '../data/types';
import { Map, List, Set } from 'immutable';
import { createSelector } from '@reduxjs/toolkit';
import { JumpHandler, TimerHandler } from './actions';

export const titleSelector = state => state.get('title') as string;
export const questionSelector = state => state.get('question') as number;
export const questionStateSelector = state => state.get('questionState') as QuestionState;
export const teamsSelector = state => state.get('teams') as Map<TeamId, Team>;
export const quizzersSelector = state => state.get('quizzers') as Map<QuizzerId, Quizzer>;
export const lineupsSelector = state => state.get('lineups') as List<Lineup>;
export const seatsSelector = state => state.get('seats') as Map<SeatId,Seat>;
export const scoresSelector = state => state.get('scores') as List<Score>;
export const jumpedSelector = state => state.get('jumped') as Set<SeatId>;
export const timerNameSelector = state => state.get('timerName') as string;
export const timeLeftSelector = state => state.get('timeLeft') as number;
export const jumpHandlerSelector = state => state.get('jumpHandler') as JumpHandler;
export const timerHandlerSelector = state => state.get('timerHandler') as TimerHandler;

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
export const answerInfoSelector = createSelector(questionSelector, seatsSelector, jumpedSelector, 
    (question,seats,jumped) => jumped.map(seatId => {
        const { teamId, quizzerId } = seats.get(seatId);
        return { question, teamId, quizzerId }
    }));
export const jumpedInfoSelector = createSelector(jumpedSelector, seatsSelector, quizzersSelector, teamsSelector, lineupsSelector,
    (jumped, seats, quizzers, teams, lineups) => jumped
        .map(seatId => seats.get(seatId))
        .map(seat => ({
            seatId: seat.id,
            name: quizzers.get(seat.quizzerId)?.abbrName,
            teamName: teams.get(seat.teamId)?.abbrName,
            color: lineups.find(a => a.teamId === seat.teamId)?.color
        })));

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