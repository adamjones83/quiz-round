import { QuestionState, Team, Quizzer, Lineup, Seat, Score,
    TeamId, QuizzerId, SeatId, SeatMap, PopupType, Meet } from '../../types';
import { RoundState } from './reducer'
import { Map, List, Set } from 'immutable';
import { createSelector } from '@reduxjs/toolkit';

export const titleSelector = (state:RoundState):string => state.get('title') as string;
export const questionSelector = (state:RoundState):number => state.get('question') as number;
export const questionStateSelector = (state:RoundState):QuestionState => state.get('questionState') as QuestionState;
export const meetsSelector = (state:RoundState):Map<string,Meet> => state.get('meets') as Map<string,Meet>;
export const teamsSelector = (state:RoundState):Map<TeamId,Team> => state.get('teams') as Map<TeamId, Team>;
export const quizzersSelector = (state:RoundState):Map<QuizzerId,Quizzer> => state.get('quizzers') as Map<QuizzerId, Quizzer>;
export const lineupsSelector = (state:RoundState):List<Lineup> => state.get('lineups') as List<Lineup>;
export const defaultLineupsSelector = (state:RoundState):Map<TeamId,Lineup> => state.get('defaultLineups') as Map<TeamId, Lineup>;
export const seatsSelector = (state:RoundState):Map<SeatId,Seat> => state.get('seats') as Map<SeatId,Seat>;
export const scoresSelector = (state:RoundState):List<Score> => state.get('scores') as List<Score>;
export const jumpedSelector = (state:RoundState):Set<SeatId> => state.get('jumped') as Set<SeatId>;
export const timeLeftSelector = (state:RoundState):number => state.get('timeLeft') as number;
export const seatMapsSelector = (state:RoundState):List<SeatMap> => state.get('bonusSeatMaps') as List<SeatMap>;
export const showPopupSelector = (state:RoundState):PopupType => state.get('showPopup') as PopupType;
export const colorSelector = (state:RoundState):List<string> => state.get('colors') as List<string>;
export const roundIdSelector = (state:RoundState):string => state.get('roundId') as string;
export const meetIdSelector = (state:RoundState):string => state.get('meetId') as string;

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
export const answerInfoSelector = createSelector(jumpedSelector, seatsSelector, quizzersSelector, teamsSelector, lineupsSelector, colorSelector,
    (jumped, seats, quizzers, teams, lineups, colors) => jumped
        .toList()
        .map(seatId => seats.get(seatId))
        .filter(seat => seat && seat.isEnabled)
        .map(seat => ({
            seatId: seat.id,
            teamId: seat.teamId,
            quizzerId: seat.quizzerId,
            name: quizzers.get(seat.quizzerId)?.abbrName,
            teamName: teams.get(seat.teamId)?.abbrName,
            color: colors.get(lineups.findIndex(a => a.teamId === seat.teamId))
    })));
export const bonusInfoSelector = createSelector(jumpedSelector, seatsSelector, quizzersSelector, teamsSelector, lineupsSelector, colorSelector, seatMapsSelector,
    (jumped, seats, quizzers, teams, lineups, colors, seatMaps) => jumped
        .flatMap(seatId => seatMaps.filter(s => s.from === seatId).map(s => s.to))
        .toList()
        .map(seatId => seats.get(seatId))
        .filter(seat => seat && seat.isEnabled)
        .map(seat => ({
            seatId: seat.id,
            teamId: seat.teamId,
            quizzerId: seat.quizzerId,
            name: quizzers.get(seat.quizzerId)?.abbrName,
            teamName: teams.get(seat.teamId)?.abbrName,
            color: colors.get(lineups.findIndex(a => a?.teamId === seat.teamId))
    })));
export const scorePartsSelector = createSelector(roundIdSelector, meetIdSelector, questionSelector,
    (roundId, meetId, question) => ({roundId, meetId, question}));
    
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