import { inject } from "@angular/core";
import { Flight } from "../model/flight";
import { TicketStore } from "./ngrx-signals/tickets.signal.store";

export function injectTicketFeature() {
  const store = inject(TicketStore);

  return {
    flights: store.flightEntities,
    filteredFlights: store.filteredFlights,
    search: (from: string, to: string, urgent = false) =>
      store.loadFlights({ from, to, urgent }),
    update: (flight: Flight) =>
      store.updateFlight(flight),
    clear: () =>
      store.clearFlights,
  };
}
