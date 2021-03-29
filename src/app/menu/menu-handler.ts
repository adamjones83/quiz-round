import { nanoid } from 'nanoid';

export type MenuEventHandler = (evt:MenuEvent<unknown>)=>void;
export interface MenuEvent<T> {
    name:string,
    args?:T
}
export const menuEvents = function() {
    const handlers: Record<string,MenuEventHandler> = {};
    function addHandler(handler:MenuEventHandler) {
        const id = nanoid();
        handlers[id] = handler;
        return function dispose() { delete handlers[id] }
    }
    function raiseEvent<T>(evt:MenuEvent<T>) {
        for(const handler of Object.values(handlers)) {
            try{ handler(evt); }
            catch { }
        }
    }
    return { addHandler, raiseEvent };
}();
