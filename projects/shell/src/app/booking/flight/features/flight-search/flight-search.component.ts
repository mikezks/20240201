import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, take } from 'rxjs';
import { ticketActions } from '../../logic/+state/tickets.actions';
import { ticketFeature } from '../../logic/+state/tickets.reducer';
import { FlightCardComponent } from '../../ui/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui/flight-filter/flight-filter.component';
import { injectTicketFeature } from '../../logic/+state/tickets.facade';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';


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
  protected ticketFeature = injectTicketFeature();

  protected from = signal('Hamburg');
  protected to = signal('Graz');
  protected flights = this.store.selectSignal(ticketFeature.selectFlights);
  protected basket: Record<number, boolean> = {
    3: true,
    5: true,
  };
  protected lazyFrom$ = toObservable(this.from).pipe(
    debounceTime(300)
  );
  protected lazyFrom = toSignal(this.lazyFrom$, {
    initialValue: this.from()
  });
  protected flightRoute = computed(
    () => 'From ' + this.lazyFrom() + ' to ' + this.to() + '.'
  );

  constructor() {
    effect(
      () => console.log(this.flightRoute())
    );
  }

  protected search(): void {
    if (!this.from() || !this.to()) {
      return;
    }

    this.ticketFeature.search(this.from(), this.to());
  }

  delay(): void {
    const oldFlight = this.flights()[0];
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
    };

    this.store.dispatch(ticketActions.flightUpdate({ flight: newFlight }));
  }

  clear(): void {
    this.store.dispatch(ticketActions.flightsClear());
  }
}
