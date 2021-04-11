import { seatEvents } from '../../ipc-events';
import { jumpHandler } from "./jump-handler";

export function initSeatHandler():void {
    (window['SEATS'] as typeof seatEvents).addHandler(statuses => {
        jumpHandler.update(statuses);
    })
}
