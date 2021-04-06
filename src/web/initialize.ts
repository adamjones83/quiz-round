import { updateQuizzers, updateTeams, updateLineups, getSeatId, setBonusSeatmaps, updateDefaultLineups, showPopup } from './redux/actions';
import { initJumpHandler, initTimerHandler, timerHandler } from './handlers';
import { addDebugActions } from './redux/debug-actions';
import { shuffle, toLookup } from './utils';
import { hookupKeyboardJumps } from './keyboard-jumps';
import { PopupType, QuizClient } from '../types';
import { menuEvents } from '../ipc-events';
import { Dispatch } from 'redux';
import { RoundState } from './redux/reducer';
import { Store } from 'redux';
import { MenuEventType } from '../ipc-types';

export async function initialize(store:Store<RoundState>, client:QuizClient):Promise<void> {
    const { getState, dispatch } = store;

    // write some warnings for TODO items that *should* be done because they are structural
    // but they may not prevent the proper operation of the app - easily missed if not noted
    DisplayWarnings();

    Object.assign(global, { getState, dispatch });
    addDebugActions(getState, dispatch);

    // initialize jump & timer handlers
    initJumpHandler(dispatch);
    initTimerHandler(dispatch);

    // load quizzers, teams, default lineups
    const quizzers = toLookup(await client.getQuizzers(), a => a.id);
    dispatch(updateQuizzers(quizzers));
    const teams = toLookup(await client.getTeams(), a => a.id);
    dispatch(updateTeams(teams));
    const lineups = toLookup(await client.getDefaultLineups(), a => a.teamId);
    dispatch(updateDefaultLineups(lineups));

    // load lineups for this quiz round
    const teamIds = shuffle(Object.keys(teams)).slice(0,2);
    dispatch(updateLineups(teamIds.map(teamId => lineups[teamId])));

    // set seat maps for bonuses
    dispatch(setBonusSeatmaps(defaultSeatMaps()));

    // add keyboard jump handler
    hookupKeyboardJumps();

    // respond to menu-command events
    handleMenuActions(dispatch);
}

const menuPopups:Partial<Record<MenuEventType,PopupType>> = {
    ['pick-lineups']: 'lineups',
    ['show-scores']: 'scores',
    ['set-question']: 'set-question',
    foul: 'foul',
    timeout: 'timeout',
    challenge: 'challenge',
    appeal: 'appeal'  
};

function handleMenuActions(dispatch:Dispatch) {
    (window['MENU'] as typeof menuEvents).addHandler(type => {
        const popup = menuPopups[type];
        if(popup) {
            dispatch(showPopup(popup));
            return;
        }
        console.warn('Unrecognized menu event - ' + type);
    });
}

function defaultSeatMaps() {
    const seatMaps = [];
    for(let i=0;i<5;i++) {
        seatMaps.push({ from: getSeatId(0, i), to: getSeatId(1, i) });
        seatMaps.push({ from: getSeatId(0, i), to: getSeatId(2, i) });
        seatMaps.push({ from: getSeatId(1, i), to: getSeatId(0, i) });
        seatMaps.push({ from: getSeatId(1, i), to: getSeatId(2, i) });
        seatMaps.push({ from: getSeatId(2, i), to: getSeatId(0, i) });
        seatMaps.push({ from: getSeatId(2, i), to: getSeatId(1, i) });
    }
    return seatMaps;
}

function DisplayWarnings() {
    console.warn('Hardware Rendering is currently disabled from main.ts');
    console.warn('using a non-minified react for development, swap with minified for production');
    console.warn('Figure out about context isolation that should be enabled in main.ts during browser setup');
}