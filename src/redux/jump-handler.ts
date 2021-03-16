import { Dispatch } from 'redux';
import { jumpChanged, jumpCompleted } from './actions';

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
                dispatch(jumpChanged(alreadyUp));
                dispatch(jumpCompleted(alreadyUp));
            }
        }
    }
    const clear = () => {
        isSet = false;
        dispatch(jumpChanged(Object.keys(jumped)));
    }
    return { jump, sit, set, clear };
}
