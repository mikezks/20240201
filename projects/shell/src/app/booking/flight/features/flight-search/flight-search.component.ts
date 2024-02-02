import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, pipe, take, tap } from 'rxjs';
import { ticketActions } from '../../logic/+state/tickets.actions';
import { ticketFeature } from '../../logic/+state/tickets.reducer';
import { FlightCardComponent } from '../../ui/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui/flight-filter/flight-filter.component';
import { injectTicketFeature } from '../../logic/+state/tickets.facade';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FlightFilter } from '../../logic/model/flight-filter';
import { patchState, signalState } from '@ngrx/signals';
import { Flight } from '../../logic/model/flight';
import { rxMethod } from '@ngrx/signals/rxjs-interop';


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

  protected localState = signalState({
    filter: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false
    },
    basket: {
      3: true,
      5: true
    } as Record<number, boolean>,
    flights: [] as Flight[]
  });

  constructor() {
    this.connectInitialLogic();
  }

  private connectInitialLogic(): void {
    // Conntect local and global State Management
    rxMethod<Flight[]>(pipe(
      tap(flights => patchState(this.localState, { flights }))
    ))(
      this.store.select(this.ticketFeature.flights)
    );
  }

  protected search(filter: FlightFilter): void {
    patchState(this.localState, { filter });

    if (!this.localState.filter.from() || !this.localState.filter.to()) {
      return;
    }

    this.ticketFeature.search(
      this.localState.filter.from(),
      this.localState.filter.to()
    );
  }

  delay(): void {
    const oldFlight = this.ticketFeature.flights()[0];
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

  select(id: number, selected: boolean): void {
    patchState(this.localState, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    }));
  }
}
