import { Routes } from "@angular/router";
import { FlightEditComponent } from "./features/flight-edit/flight-edit.component";
import { FlightSearchComponent } from "./features/flight-search/flight-search.component";
import { FlightBookingComponent } from "./features/flight-booking/flight-booking.component";
import { flightsResolverConfig } from "./logic/data-access/flight.resolver";
import { FlightTypeaheadComponent } from "./features/flight-typeahead/flight-typeahead.component";
import { provideState } from "@ngrx/store";
import { ticketFeature } from "./logic/+state/tickets.reducer";
import { provideEffects } from "@ngrx/effects";


export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    providers: [
      provideState(ticketFeature),
      provideEffects()
    ],
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: FlightSearchComponent,
      },
      {
        path: 'edit/:id',
        component: FlightEditComponent,
        resolve: flightsResolverConfig
      },
      {
        path: 'typeahead',
        component: FlightTypeaheadComponent
      }
    ]
  }
];

export default FLIGHT_ROUTES;
