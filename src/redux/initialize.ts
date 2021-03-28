import { setTimerHandler, setJumpHandler, updateQuizzers, updateTeams, updateLineups, getSeatId, setBonusSeatmaps, updateDefaultLineups } from './actions';
import { addDebugActions } from './debug-actions';
import { shuffle, toLookup } from './utils';
import { hookupKeyboardJumps } from './keyboard-jumps';
import { ExposedFunctions } from '../preload';

export async function initialize(store, client:ExposedFunctions) {
    const { getState, dispatch } = store;
    
    Object.assign(global, { getState, dispatch });
    addDebugActions(getState, dispatch);

    dispatch(setTimerHandler(dispatch));
    dispatch(setJumpHandler(dispatch));
    
    // load quizzers
    const quizzers = toLookup(await client.getQuizzers(), a => a.id);
    dispatch(updateQuizzers(quizzers));
    const teams = toLookup(await client.getTeams(), a => a.id);
    dispatch(updateTeams(teams));
    const lineups = toLookup(await client.getLineups(), a => a.teamId);
    dispatch(updateDefaultLineups(lineups));

    // load lineups for this quiz round
    const teamIds = shuffle(Object.keys(teams)).slice(0,2);
    dispatch(updateLineups(teamIds.map(teamId => lineups[teamId])));

    // set seat maps for bonuses
    const seatMaps = [];
    for(let i=0;i<5;i++) {
        seatMaps.push({ from: getSeatId(0, i), to: getSeatId(1, i) });
        seatMaps.push({ from: getSeatId(0, i), to: getSeatId(2, i) });
        seatMaps.push({ from: getSeatId(1, i), to: getSeatId(0, i) });
        seatMaps.push({ from: getSeatId(1, i), to: getSeatId(2, i) });
        seatMaps.push({ from: getSeatId(2, i), to: getSeatId(0, i) });
        seatMaps.push({ from: getSeatId(2, i), to: getSeatId(1, i) });
    }
    dispatch(setBonusSeatmaps(seatMaps));

    // add keyboard jump handler
    hookupKeyboardJumps(getState);
}
