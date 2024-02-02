import { createFeature, createReducer, on } from "@ngrx/store";
import { Flight } from "../model/flight";
import { ticketActions } from "./tickets.actions";


export interface TicketState {
  flights: Flight[];
  basket: unknown;
  tickets: unknown;
}

export const initialTicketState: TicketState = {
  flights: [],
  basket: {},
  tickets: {}
};


export const ticketFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketState,

    on(ticketActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    })),

    on(ticketActions.flightUpdate, (state, action) => ({
      ...state,
      flights: state.flights.map(
        flight => flight.id === action.flight.id ? action.flight : flight
      )
    })),

    on(ticketActions.flightsClear, (state) => ({
      ...state,
      flights: []
    })),
  )
})
