import { inject } from "@angular/core"
import { Store } from "@ngrx/store"
import { ticketActions } from "./tickets.actions";
import { ticketFeature } from "./tickets.reducer";

export function injectTicketFeature() {
  const store = inject(Store);

  return {
    flights: store.selectSignal(ticketFeature.selectFlights),
    search: (from: string, to: string) =>
      store.dispatch(ticketActions.flightsLoad({ from, to}))
  };
}
