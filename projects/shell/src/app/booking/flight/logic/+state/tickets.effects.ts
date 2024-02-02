import { Injectable, inject } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { FlightService } from "../data-access/flight.service";
import { ticketActions } from "./tickets.actions";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class TicketsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private flightService = inject(FlightService);

  loadFlights = createEffect(
    /**
     * Stream 1: Action
     *  - Trigger
     *  - State Provider: from, to (City names)
     */
    () => this.actions$.pipe(
      // Filtering: Action
      ofType(ticketActions.flightsLoad),
      concatLatestFrom(() => this.store),
      /**
       * Stream 2: HTTP Backend API Call
       *  - State Provider: Array of Flights
       */
      switchMap(([action, state]) => this.flightService.find(action.from, action.to)),
      // Transformation: Flights -> Action
      map(flights => ticketActions.flightsLoaded({ flights}))
    )
  );

  loadFlightById = createEffect(
    () => this.actions$.pipe(
      ofType(ticketActions.flightLoadById),
      switchMap(action => this.flightService.findById(action.id)),
      map(flight => ticketActions.flightLoaded({ flight }))
    )
  );
}
