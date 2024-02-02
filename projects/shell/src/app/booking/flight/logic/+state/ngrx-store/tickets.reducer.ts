import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { routerFeature } from "../../../../../shared/+state/router.feature";
import { initialFlight } from "../../model/flight";
import { ticketActions } from "../tickets.actions";
import { initialTicketState } from '../tickets.model';


export const ticketFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketState,

    on(ticketActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    })),

    on(ticketActions.flightLoaded, (state, action) => ({
      ...state,
      flights: [
        ...state.flights.filter(
          flight => flight.id !== action.flight.id
        ),
        action.flight
      ]
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
  ),
  extraSelectors: ({ selectFlights, selectHide }) => ({
    selectFilteredFlights: createSelector(
      // Selectors
      selectFlights,
      selectHide,
      // Projector
      (flights, hide) => flights.filter(
        flight => !hide.includes(flight.id)
      )
    ),
    selectCurrentFlight: createSelector(
      selectFlights,
      routerFeature.selectRouteParams,
      (flights, params) => {
        console.log(flights, params);
        const id = +params['id'];
        let resultFlight = initialFlight;

        if (id) {
          const flight = flights.find(f => f.id === id);
          if (flight) {
            resultFlight = flight;
          }
        }

        return resultFlight;
      }
    )
  })
});