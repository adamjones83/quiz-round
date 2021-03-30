import { nanoid } from 'nanoid';

export function CreateEventSource<T>() {
    const handlers: Record<string,CustomEventHandler<T>> = {};
    function addHandler(handler:CustomEventHandler<T>) {
        const id = nanoid();
        handlers[id] = handler;
        return function dispose() { delete handlers[id] }
    }
    function raiseEvent(data:T) {
        for(const handler of Object.values(handlers)) {
            try{ handler(data); }
            catch { }
        }
    }
    return { addHandler, raiseEvent };
}

type CustomEventHandler<T> = (data:T) => void;
