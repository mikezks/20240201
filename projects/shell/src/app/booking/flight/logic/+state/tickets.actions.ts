import { createActionGroup, props } from "@ngrx/store";
import { Flight } from "../model/flight";

export const ticketActions = createActionGroup({
  source: 'tickets',
  events: {
    'flights loaded': props<{ flights: Flight[] }>()
  }
});
