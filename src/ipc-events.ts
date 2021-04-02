import { CreateEventSource } from './event-source';
import { MenuEventType, SeatStatus } from './ipc-types';

/** Used by both main.ts & prerender.ts */
export const menuEvents = CreateEventSource<MenuEventType>();
export const seatEvents = CreateEventSource<SeatStatus[]>();
