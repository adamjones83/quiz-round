import { AnyAction, Dispatch, MiddlewareAPI, Action } from "redux";
import { PayloadAction } from '@reduxjs/toolkit';
import { RoundState } from "./reducer";
import { jumpedSelector, questionStateSelector } from "./selectors";

type DebugMiddleware = (storeApi:MiddlewareAPI<Dispatch<AnyAction>,RoundState>) => (next:(action:Action)=>void)=>(action:PayloadAction<unknown>)=>void
export function storeDebugMiddleware(storeApi:MiddlewareAPI<Dispatch<AnyAction>,RoundState>): ReturnType<DebugMiddleware> {
    Object.assign(global, {
        ACTION_DEBUG: true, 
        JUMP_ACTION_DEBUG: false, 
        QUESTION_STATE_DEBUG: false 
    })
    let currentQuestionState = '';
    
    return function wrapDispatch(next) {
        return function handleAction(action) {
            const { ACTION_DEBUG, JUMP_ACTION_DEBUG, QUESTION_STATE_DEBUG } = global as unknown as { [key:string]:boolean };
            
            const state = storeApi.getState();
            
            if(ACTION_DEBUG) console.log(`ACTION: ${action.type}`, { payload:action.payload, state });
            if(JUMP_ACTION_DEBUG && action.type === 'JUMP_CHANGED')
                console.log('Jump changed', jumpedSelector(state).toJS());
            
            const questionState = questionStateSelector(state);
            if(currentQuestionState !== questionState) {
                if(QUESTION_STATE_DEBUG) console.log(`Question state changed - OLD:${currentQuestionState}, NEW:${questionState}`);
                currentQuestionState = questionState;
            }
        
            next(action);
        }
    }
}
