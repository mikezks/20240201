import { inject } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, filter } from "rxjs";
import { ticketFeature } from "../+state/ngrx-store/tickets.reducer";
import { Flight, initialFlight } from "../../logic/model/flight";
import { ticketActions } from "../+state/tickets.actions";


export const resolveFlights = (route: ActivatedRouteSnapshot): Observable<Flight> => {
  const store = inject(Store);
  return store.select(ticketFeature.selectCurrentFlight).pipe(
    filter(flight => {
      if (flight === initialFlight) {
        store.dispatch(
          ticketActions.flightLoadById({ id: +route.params['id'] })
        );

        return false;
      }
      return true;
    })
  );
};

export const flightsResolverConfig = {
  flight: resolveFlights
};
