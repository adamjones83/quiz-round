import { CreateEventSource } from './event-source';
import { MenuEventType } from './ipc-types';

/** Used by both main.ts & prerender.ts */
export const menuEvents = CreateEventSource<MenuEventType>();
