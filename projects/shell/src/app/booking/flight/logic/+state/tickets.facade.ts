import { inject } from "@angular/core"
import { Store } from "@ngrx/store"
import { ticketActions } from "./tickets.actions";
import { ticketFeature } from "./tickets.reducer";
import { Flight } from "../model/flight";

export function injectTicketFeature() {
  const store = inject(Store);

  return {
    flights: store.selectSignal(ticketFeature.selectFlights),
    filteredFlights: store.selectSignal(ticketFeature.selectFilteredFlights),
    search: (from: string, to: string) =>
      store.dispatch(ticketActions.flightsLoad({ from, to })),
    update: (flight: Flight) =>
      store.dispatch(ticketActions.flightUpdate({ flight })),
    clear: () =>
      store.dispatch(ticketActions.flightsClear()),
  };
}
