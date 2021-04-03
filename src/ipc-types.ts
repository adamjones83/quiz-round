export const MENU_EVENT = 'menu-event';
export type MenuEventType = 'pick-lineups' | 'timeout' | 'foul' | 'challenge' | 'appeal' | 'show-scores' | 'set-question';

export const SEAT_STATUS_EVENT = 'seat-status-update';
export interface SeatStatus { seatId: string, isJumped: boolean }

export const DATA_REQUEST = 'data-request';
export type DataRequestType = 'get-quizzers' | 'get-teams' | 'get-lineups' | 'get-meets';

export const DATA_SAVE = 'data-save';
export type DataSaveType = 'save-quizzer' | 'save-team' | 'save-default-lineup' |
    'save-meet' | 'save-round' | 'save-scores';
