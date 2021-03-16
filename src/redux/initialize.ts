import { setTimerHandler, setJumpHandler, updateQuizzers, updateTeams, updateLineups } from './actions';
import { Team, Quizzer, Lineup } from '../data/types';
import { addDebugActions } from './debug-actions';
import { TeamColor } from '../data/colors';
import { shuffle, toLookup } from './utils';
import { Client } from '../data/client';

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

    // load lineups for this quiz round
    const teamIds = shuffle(Object.keys(teams)).slice(0,3);
    const lineups:Lineup[] = teamIds.map(teamId => teams[teamId].defaultLineup);
    for(let i=0;i<3;i++) lineups[i].color = [TeamColor.blue, TeamColor.green, TeamColor.red][i];
    dispatch(updateLineups(lineups));
}