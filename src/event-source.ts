import { nanoid } from 'nanoid';

export function CreateEventSource<T>():{ addHandler:(handler:CustomEventHandler<T>)=>void, raiseEvent:(data:T)=>void } {
    const handlers: Record<string,CustomEventHandler<T>> = {};
    function addHandler(handler:CustomEventHandler<T>) {
        const id = nanoid();
        handlers[id] = handler;
        return function dispose() { delete handlers[id] }
    }
    function raiseEvent(data:T) {
        for(const handler of Object.values(handlers)) {
            try{ handler(data); }
            catch { } // eslint-disable-line no-empty
        }
    }
    return { addHandler, raiseEvent };
}

type CustomEventHandler<T> = (data:T) => void;
