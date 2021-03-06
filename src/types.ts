export type QuizzerId = string; // type alias to allow more explicit id types
export type SeatId = string;
export type TeamId = string;
export type QuestionState = 'before'|'jumpset'|'answer'|'bonus';
export type ScoreType = '-unknown-'|'foul'|'2nd foul'|'timeout'|
    'overruled-challenge'|'upheld-challenge'|'overruled-appeal'|'upheld-appeal'|
    'correct'|'error'|'bonus-correct'|'bonus-error'|
    'quizout /wo error'|'error-out'|
    '2nd overruled challenge'|
    '5+ team error'|'error after 15'|
    '3rd person bonus'|'4th person bonus'|'5th person bonus';
export type PopupType = 'none'|'restart-round'|'set-round-title'|'edit-quizzers'|
'jump'|'set-question'|'scores'|'lineups'|'timeout'|'foul'|'challenge'|'appeal';
export type BonusHandlingType = 'auto' | 'manual';
export type TimerType = 'timeout-timer'|'jump-timer'|'answer-timer';
export type SoundType = 'jump'|'right'|'wrong'|'timeout-timer'|'jump-timer'|'answer-timer'|'round-complete';
export interface Round {
    id: string,
    meetId: string,
    name: string,
    startsOn: string // ISO date string
}
export interface Meet {
    id: string,
    name: string,
    startsOn: string // ISO date string
}
export interface Score {
    id: string,
    roundId: string,
    meetId: string,
    question: number,
    teamId: string,
    quizzerId?: string,
    isTeamOnly: boolean,
    value: number,
    type: ScoreType,
    createdOn: string // ISO date string
}
export interface Team {
    id: string,
    name: string,
    abbrName: string
}
export interface Quizzer {
    id: string,
    name: string,
    abbrName: string,
    teamName: string
}
export interface Lineup {
    id:string,
    teamId:string,
    quizzerIds:string[],
    captainId?:string,
    coCaptainId?:string
}
export interface JumpInfo {
    isLatched: boolean,
    ids: string[]
}
export interface Seat {
    id: string,
    teamId: string,
    quizzerId: string,
    isEnabled: boolean
}
export interface SeatMap {
    from:SeatId,
    to:SeatId
}
export interface QuizClient {
    getQuizzers: () => Promise<Quizzer[]>,
    getTeams: () => Promise<Team[]>,
    getDefaultLineups: () => Promise<Lineup[]>,
    getMeets: () => Promise<Meet[]>,
    
    saveQuizzer: (quizzer:Quizzer) => Promise<void>,
    saveTeam: (team:Team) => Promise<void>,
    saveDefaultLineup: (lineup:Lineup) => Promise<void>,
    saveMeet: (meet:Meet) => Promise<void>,
    saveRound: (round:Round) => Promise<void>,
    saveScores: (scores:Score[]) => Promise<void>
}
/*
    before: JumpSet, Timeout, Challenge/Appeal
    jumpset: SetTimer, Jump, Cancel
    answer: Correct, Error, Cancel
    bonus: Correct, Error
*/

