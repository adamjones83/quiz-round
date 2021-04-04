/* eslint-disable @typescript-eslint/no-empty-function */
import { AnyAction, Dispatch } from 'redux';
import { jumpChanged, jumpCompleted } from '../redux/actions';

interface SeatStatus {
    id:string,
    jumped:boolean
}
export interface JumpHandler {
    disable: (seatId:string) => void,
    enable: (seatId:string) => void,
    update: (statuses:SeatStatus[]) => void,
    jump: (id: string) => void,
    sit: (id: string) => void,
    set: () => void,
    clear: () => void
}

function CreateJumpHandler(dispatch: Dispatch): JumpHandler {
    // wrapping dispatches in a thread escaping function so it doesn't cause problems
    // when one of the exposed functions is called from an action dispatch handler
    const innerDispatch = (action:AnyAction) => setTimeout(() => dispatch(action),0);
    let isSet = false;
    const disabled = {};
    const jumped = {};
    let latched = {};

    const enable = (seatId:string) => {
        delete disabled[seatId];
    }
    const disable = (seatId:string) => {
        disabled[seatId] = true;
        delete jumped[seatId];
        if(!isSet) {
            innerDispatch(jumpChanged(Object.keys(jumped)));
        }
    }
    /** batch update of seat statuses */
    const update = (statuses:SeatStatus[]) => {
        statuses.forEach(({id,jumped}) => {
            if(!disabled[id]) {
                if(jumped) jumped[id] = true;
                else delete jumped[id];
            }
        });
        const jumpedIds = Object.keys(jumped);
        if(!isSet) {
            innerDispatch(jumpChanged(jumpedIds));
        } else if(jumpedIds.length && !Object.keys(latched).length) {
            jumpedIds.forEach(id => latched[id] = true);
            innerDispatch(jumpChanged(jumpedIds));
            innerDispatch(jumpCompleted());
        }
    }
    const jump = id => {
        if(disabled[id]) return;
        jumped[id] = true;
        if (!isSet) {
            innerDispatch(jumpChanged(Object.keys(jumped)));
        } else if (!Object.keys(latched).length) { // set but no seat is "latched"
            latched[id] = true;
            innerDispatch(jumpChanged([id]));
            innerDispatch(jumpCompleted());
        }
    }
    const sit = id => {
        delete jumped[id];
        if (!isSet) {
            innerDispatch(jumpChanged(Object.keys(jumped)));
        }
    }
    const set = () => {
        if (!isSet) {
            isSet = true;
            latched = {};
            const alreadyUp = Object.keys(jumped);
            if (alreadyUp.length) {
                alreadyUp.forEach(id => latched[id] = true);
                innerDispatch(jumpCompleted());
            }
        }
    }
    const clear = () => {
        isSet = false;
        innerDispatch(jumpChanged(Object.keys(jumped)));
    }
    return { enable, disable, update, jump, sit, set, clear };
}


// hack - this has no-op actions until initialized with initJumpHandler
export const jumpHandler: JumpHandler = {
    enable: () => { },
    disable: () => { },
    update: () => { },
    jump: () => { },
    sit: () => { },
    set: () => { },
    clear: () => { }
};

export function initJumpHandler(dispatch: Dispatch):void {
    Object.assign(jumpHandler, CreateJumpHandler(dispatch));
}