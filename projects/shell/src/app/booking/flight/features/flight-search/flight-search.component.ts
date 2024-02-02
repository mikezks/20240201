import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { pipe, tap } from 'rxjs';
import { injectTicketFeature } from '../../logic/+state/tickets.facade';
import { ticketActions } from '../../logic/+state/tickets.actions';
import { Flight } from '../../logic/model/flight';
import { FlightFilter } from '../../logic/model/flight-filter';
import { FlightCardComponent } from '../../ui/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui/flight-filter/flight-filter.component';


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
  protected readonly ticketFacade = injectTicketFeature();

  protected readonly localState = signalState({
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
      this.ticketFacade.flights
    );
  }

  protected search(filter: FlightFilter): void {
    patchState(this.localState, { filter });

    if (!this.localState.filter.from() || !this.localState.filter.to()) {
      return;
    }

    this.ticketFacade.search(
      this.localState.filter.from(),
      this.localState.filter.to()
    );
  }

  protected delay(): void {
    const oldFlight = this.ticketFacade.flights()[0];
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
    };

    this.ticketFacade.update(newFlight );
  }

  protected clear(): void {
    this.ticketFacade.clear();
  }

  protected select(id: number, selected: boolean): void {
    patchState(this.localState, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    }));
  }
}
