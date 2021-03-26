import { Dispatch } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Map, Set, List } from 'immutable';
import { QuestionState, SeatId } from '../../data/types';
import { RoundState } from '../reducer';
import { jumpedSelector, questionStateSelector } from '../selectors';

const SET_JUMP_HANDLER = 'SET_JUMP_HANDLER';
const JUMPSET = 'JUMPSET';
const CLEARSET = 'CLEARSET';
const JUMP_CHANGED = 'JUMP_CHANGED';
const JUMP_COMPLETED = 'JUMP_COMPLETED';

export const setJumpHandler = createAction<Dispatch>(SET_JUMP_HANDLER);
export const jumpset = createAction(JUMPSET);
export const clearset = createAction(CLEARSET);
export const jumpChanged = createAction<SeatId[]>(JUMP_CHANGED);
export const jumpCompleted = createAction(JUMP_COMPLETED);

export interface JumpHandler {
    jump: (id:string) => void,
    sit: (id:string) => void,
    set: () => void,
    clear: () => void
}

export function CreateJumpHandler(dispatch:Dispatch) : JumpHandler {
    let isSet = false;
    let jumped = { };
    let latched = { };
    
    const jump = id => {
        jumped[id] = true;
        if(!isSet) {
            dispatch(jumpChanged(Object.keys(jumped)));
        } else if(!Object.keys(latched).length) { // set but no seat is "latched"
            latched[id] = true;
            dispatch(jumpChanged([id]));
            dispatch(jumpCompleted());
        }
    }
    const sit = id => {
        delete jumped[id];
        if(!isSet) {
            dispatch(jumpChanged(Object.keys(jumped)));
        }
    }
    const set = () => {
        if(!isSet) {
            isSet = true;
            latched = { };
            const alreadyUp = Object.keys(jumped);
            if(alreadyUp.length) {
                alreadyUp.forEach(id => latched[id] = true);
            }
            dispatch(jumpset());
        }
    }
    const clear = () => {
        isSet = false;
        dispatch(clearset());
        dispatch(jumpChanged(Object.keys(jumped)));
    }
    return { jump, sit, set, clear };
}

export function addJumpActions(builder:ActionReducerMapBuilder<RoundState>) {
    builder
        .addCase(setJumpHandler, (state, action) => state.set('jumpHandler', CreateJumpHandler(action.payload)))
        .addCase(jumpset, state => {
            const questionState = questionStateSelector(state);
            if(questionState !== 'before') return state;
            const isJumped = jumpedSelector(state).count();
            return state.set('questionState', isJumped ? 'answer': 'jumpset');
        })
        .addCase(clearset, state => {
            const questionState = questionStateSelector(state);
            if(questionState !== 'jumpset') return state;
            return state.set('questionState', 'before');
        })
        .addCase(jumpChanged, (state, action) => (state as unknown as RoundState)
            .set('jumped', Set(action.payload))
            .update('questionState', value => value === 'jumpset' ? 'answer' : value))
    
}