/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch } from 'redux';
import { jumpChanged, jumpCompleted } from '../redux/actions';

interface SeatStatus {
    id:string,
    jumped:boolean
}
export interface JumpHandler {
    update: (statuses:SeatStatus[]) => void,
    jump: (id: string) => void,
    sit: (id: string) => void,
    set: () => void,
    clear: () => void
}

function CreateJumpHandler(dispatch: Dispatch): JumpHandler {
    let isSet = false;
    const jumped = {};
    let latched = {};

    /** batch update of seat statuses */
    const update = (statuses:SeatStatus[]) => {
        statuses.forEach(({id,jumped}) => {
            if(jumped) jumped[id] = true;
            else delete jumped[id];
        });
        const jumpedIds = Object.keys(jumped);
        if(!isSet) {
            dispatch(jumpChanged(jumpedIds));
        } else if(jumpedIds.length && !Object.keys(latched).length) {
            jumpedIds.forEach(id => latched[id] = true);
            dispatch(jumpChanged(jumpedIds));
            dispatch(jumpCompleted());
        }
    }
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
    return { update, jump, sit, set, clear };
}


// hack - this has no-op actions until initialized with initJumpHandler
export const jumpHandler: JumpHandler = {
    update: () => { },
    jump: () => { },
    sit: () => { },
    set: () => { },
    clear: () => { }
};

export function initJumpHandler(dispatch: Dispatch):void {
    Object.assign(jumpHandler, CreateJumpHandler(dispatch));
}