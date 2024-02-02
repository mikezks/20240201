import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FlightService } from "../data-access/flight.service";
import { ticketActions } from "./tickets.actions";
import { map, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TicketsEffects {
  private actions$ = inject(Actions);
  private flightService = inject(FlightService);

  loadFlights = createEffect(
    () => this.actions$.pipe(
      ofType(ticketActions.flightsLoad),
      switchMap(action => this.flightService.find(action.from, action.to)),
      map(flights => ticketActions.flightsLoaded({ flights}))
    )
  );
}
