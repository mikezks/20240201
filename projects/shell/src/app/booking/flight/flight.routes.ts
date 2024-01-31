import { Routes } from "@angular/router";
import { FlightEditComponent } from "./features/flight-edit/flight-edit.component";
import { FlightSearchComponent } from "./features/flight-search/flight-search.component";
import { FlightBookingComponent } from "./features/flight-booking/flight-booking.component";
import { flightsResolverConfig } from "./logic/data-access/flight.resolver";


export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
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
      }
    ]
  }
];

export default FLIGHT_ROUTES;
