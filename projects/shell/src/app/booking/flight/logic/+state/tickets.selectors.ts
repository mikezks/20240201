import { createSelector } from "@ngrx/store";
import { ticketFeature } from "./tickets.reducer";

export const selectFilteredFlights = createSelector(
  // Selectors
  ticketFeature.selectFlights,
  ticketFeature.selectHide,
  // Projector
  (flights, hide) => flights.filter(
    flight => !hide.includes(flight.id)
  )
);
