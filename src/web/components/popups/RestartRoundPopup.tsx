import * as React from 'react';
import { closePopup, setRoundTitle, stateUpdate } from '../../redux/actions';
import { getDateTimeStr } from '../../utils';
import { Meet, Score } from '../../../types';
import { meetsSelector, titleSelector } from '../../redux/selectors';
import { RoundState } from '../../redux/reducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { List, Map } from 'immutable';
import { nanoid } from 'nanoid';

/*
    Score handling options:
    - discard: just clear the list of scores
    - keep: keep the current scores (and question #) but update their round id
    - save: save the scores as-is then clear the list & start over

    Restart Round - save/discard scores
    Update Round Title - keeps scores
*/

interface RestartRoundPopupProps {
    title:string,
    meets:Map<string,Meet>,
    dispatch:Dispatch
}
const mapStateToProps = (state:RoundState) => ({
    title: titleSelector(state),
    meets: meetsSelector(state)
});
export const RestartRoundPopup = connect(mapStateToProps)((props:RestartRoundPopupProps) => {
    // meetId, roundId, startDate, title, scoreHandling
    const { meets,dispatch } = props;
    const oldTitle = props.title;
    const [meetId,setMeetId] = React.useState('');
    const [title,setTitle] = React.useState(oldTitle);
    const [save,setSave] = React.useState(true);
    return <React.Fragment>
        <label htmlFor='round-title'>
            <input type='text' id='round-title' name='round-title' value={title} onChange={ evt => setTitle(evt.target.value) } />
        </label>
        <select value={meetId} onChange={ evt => setMeetId(evt.target.value) }>
            <option value={null}>--none--</option>
            { meets
                .toList()
                .toArray()
                .sort((a,b) => (a.startsOn || '').localeCompare(b.startsOn || ''))
                .map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <label htmlFor='saveScores'>Save Scores
            <input id='saveScores' name='saveScores'
                type='checkbox' checked={save} onChange={ evt => setSave(evt.target.checked) } />
        </label>
        <button onClick={ () => { 
            dispatch(stateUpdate(startRound(meetId, title,save)));
            dispatch(closePopup()); } }>Ok</button>
        <button onClick={ () => dispatch(closePopup()) }>Cancel</button>
    </React.Fragment>
})


export function startRound(meetId:string, title:string, save:boolean): (state:RoundState)=>RoundState {
    const roundId = nanoid();
    const startTime = getDateTimeStr();
    
    console.log('Starting round...', { 
        meetId, roundId, title, saveScores:save, startTime
    });
    
    // optionally save scores here!!!

    return state => state.set('meetId', meetId)
        .set('roundId', roundId)
        .set('title', title)
        .set('question', 1)
        .set('startTime', startTime)
        .set('scores', List<Score>())
}
