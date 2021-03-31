import { Dispatch } from 'redux';
import { jumpChanged, jumpCompleted } from '../redux/actions';

export interface JumpHandler {
    jump: (id: string) => void,
    sit: (id: string) => void,
    set: () => void,
    clear: () => void
}

function CreateJumpHandler(dispatch: Dispatch): JumpHandler {
    let isSet = false;
    let jumped = {};
    let latched = {};

    const jump = id => {
        jumped[id] = true;
        if (!isSet) {
            dispatch(jumpChanged(Object.keys(jumped)));
        } else if (!Object.keys(latched).length) { // set but no seat is "latched"
            latched[id] = true;
            dispatch(jumpChanged([id]));
            dispatch(jumpCompleted());
        }
    }
    const sit = id => {
        delete jumped[id];
        if (!isSet) {
            dispatch(jumpChanged(Object.keys(jumped)));
        }
    }
    const set = () => {
        if (!isSet) {
            isSet = true;
            latched = {};
            const alreadyUp = Object.keys(jumped);
            if (alreadyUp.length) {
                alreadyUp.forEach(id => latched[id] = true);
            }
        }
    }
    const clear = () => {
        isSet = false;
        dispatch(jumpChanged(Object.keys(jumped)));
    }
    return { jump, sit, set, clear };
}

// hack - this has no-op actions until initialized with initJumpHandler
export const jumpHandler: JumpHandler = {
    jump: () => { },
    sit: () => { },
    set: () => { },
    clear: () => { }
};
export function initJumpHandler(dispatch: Dispatch) {
    Object.assign(jumpHandler, CreateJumpHandler(dispatch));
}