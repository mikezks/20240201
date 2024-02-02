import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../logic/data-access/flight.service';
import { Flight } from '../../logic/model/flight';
import { FlightCardComponent } from '../../ui/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui/flight-filter/flight-filter.component';
import { Store } from '@ngrx/store';
import { ticketFeature } from '../../logic/+state/tickets.reducer';
import { ticketActions } from '../../logic/+state/tickets.actions';
import { take } from 'rxjs';
import { selectFilteredFlights } from '../../logic/+state/tickets.selectors';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private store = inject(Store);
  private flightService = inject(FlightService);

  protected from = 'Hamburg';
  protected to = 'Graz';
  protected flights$ = this.store.select(selectFilteredFlights);
  protected basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  protected search(): void {
    if (!this.from || !this.to) {
      return;
    }

    this.flightService.find(this.from, this.to).subscribe({
      next: flights => this.store.dispatch(
        ticketActions.flightsLoaded({ flights })
      ),
      error: errResp => console.error('Error loading flights', errResp)
    });
  }

  delay(): void {
    this.flights$.pipe(take(1)).subscribe(flights => {
      const oldFlight = flights[0];
      const oldDate = new Date(oldFlight.date);

      const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
      const newFlight = {
        ...oldFlight,
        date: newDate.toISOString(),
      };

      this.store.dispatch(ticketActions.flightUpdate({ flight: newFlight }));
    });
  }

  clear(): void {
    this.store.dispatch(ticketActions.flightsClear());
  }
}
