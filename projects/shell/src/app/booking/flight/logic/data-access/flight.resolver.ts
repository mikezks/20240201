import { inject } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ticketFeature } from "../+state/tickets.reducer";
import { Flight } from "../../logic/model/flight";


export const resolveFlights = (route: ActivatedRouteSnapshot): Observable<Flight> => {
  return inject(Store).select(ticketFeature.selectCurrentFlight);
};

export const flightsResolverConfig = {
  flight: resolveFlights
};
