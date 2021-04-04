import * as React from 'react'
import { List } from 'immutable';
import { TeamId, Team } from '../../../types';

interface TeamSelectProps {
    teamId: TeamId,
    teams: List<Team>,
    setTeamId: (teamId:string) => void
}

export const TeamSelect = (props:TeamSelectProps):JSX.Element => {
    const { teams, teamId, setTeamId } = props;
    return <React.Fragment>
        <select value={teamId} onChange={ evt => setTeamId(evt.target.value) }>
            { teams.map(t => <option key={t.id} value={t.id}>{ t.abbrName }</option> ) }
        </select>
    </React.Fragment>
};