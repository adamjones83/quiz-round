export type QuizzerId = string; // type alias to allow more explicit id types
export type SeatId = string;
export type TeamId = string;
export type QuestionState = 'before'|'jumpset'|'answer'|'bonus';
export type ScoreType = 'foul-odd'|'foul-even'|'timeout'|
    'overruled-challenge'|'upheld-challenge'|'overruled-appeal'|'upheld-appeal'|
    'correct'|'error'|'bonus-correct'|'bonus-error'|
    'correct-quizout'|'error-errorout'|
    '5+ error'|'error after 15'|
    '3rd person bonus'|'4th person bonus'|'5th person bonus';
export interface Score {
    question: number,
    quizzerId?: string,
    teamId: string,
    type: ScoreType,
    isTeamOnly: boolean,
    value: number
}
export interface Team {
    id: string,
    name: string,
    abbrName: string,
    defaultLineup: Lineup
}
export interface Quizzer {
    id: string,
    name: string,
    abbrName: string
}
export interface Lineup {
    teamId:string,
    quizzerIds:string[],
    captainId?:string,
    coCaptainId?:string,
    color?:string
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

/*
    before: JumpSet, Timeout, Challenge/Appeal
    jumpset: SetTimer, Jump, Cancel
    answer: Correct, Error, Cancel
    bonus: Correct, Error
*/

