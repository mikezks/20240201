import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Flight } from "../model/flight";

export const ticketActions = createActionGroup({
  source: 'tickets',
  events: {
    'flights load': props<{ from: string; to: string; }>(),
    'flights loaded': props<{ flights: Flight[] }>(),
    'flight update': props<{ flight: Flight }>(),
    'flights clear': emptyProps()
  }
});
