export const MENU_EVENT = 'menu-event';
export type MenuEventType = 
'restart-round' | 'set-round-title' | 'pick-lineups' | 'show-scores' | 
'set-question' | 'timeout' | 'foul' | 'challenge' | 'appeal' |
'bonus-handling-auto' | 'bonus-handling-manual'|'sound-enabled'|'sound-disabled'|
'edit-quizzers'|'edit-teams'|'edit-meets'|'edit-sounds';
export const SEAT_STATUS_EVENT = 'seat-status-update';
export interface SeatStatus { id: string, jumped: boolean }

export const DATA_REQUEST = 'data-request';
export type DataRequestType = 'get-quizzers' | 'get-teams' | 'get-lineups' | 'get-meets';

export const DATA_SAVE = 'data-save';
export type DataSaveType = 'save-quizzer' | 'save-team' | 'save-default-lineup' |
    'save-meet' | 'save-round' | 'save-scores';
