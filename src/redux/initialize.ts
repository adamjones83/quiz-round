import { setTimerHandler, setJumpHandler, updateQuizzers, updateTeams, updateLineups, getSeatId, setBonusSeatmaps, updateDefaultLineups } from './actions';
import { Team, Quizzer, Lineup } from '../data/types';
import { addDebugActions } from './debug-actions';
import { shuffle, toLookup } from './utils';
import { Client } from '../data/client';
import { hookupKeyboardJumps } from './keyboard-jumps';

export async function initialize(store) {
    const { getState, dispatch } = store;
    
    Object.assign(global, { getState, dispatch });
    addDebugActions(getState, dispatch);

    dispatch(setTimerHandler(dispatch));
    dispatch(setJumpHandler(dispatch));
    
    // load quizzers
    const client = Client();
    const quizzers = toLookup(await client.getQuizzers(), a => a.id);
    dispatch(updateQuizzers(quizzers));
    const teams = toLookup(await client.getTeams(), a => a.id);
    dispatch(updateTeams(teams));
    const defaultLineups = toLookup((Object.values(teams) as any[]).map(team => team.defaultLineup as Lineup), (lineup:Lineup) => lineup.teamId);
    dispatch(updateDefaultLineups(defaultLineups));

    // load lineups for this quiz round
    const teamIds = shuffle(Object.keys(teams)).slice(0,2);
    const lineups:Lineup[] = teamIds.map(teamId => defaultLineups[teamId]);
    dispatch(updateLineups(lineups));

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
