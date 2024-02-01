import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { FlightService } from '../../logic/data-access/flight.service';
import { Flight } from '../../logic/model/flight';

@Component({
  selector: 'app-flight-typeahead',
  standalone: true,
  imports: [
    AsyncPipe, DatePipe, NgIf, NgFor, ReactiveFormsModule
  ],
  templateUrl: './flight-typeahead.component.html',
  styleUrl: './flight-typeahead.component.scss'
})
export class FlightTypeaheadComponent {
  private flightService = inject(FlightService);

  protected control = new FormControl('', { nonNullable: true });
  protected flights$ = this.initFlightsStream();
  protected loading = false;

  private initFlightsStream(): Observable<Flight[]> {
    /**
     * Stream 1: Input Form Changes
     *  - Trigger
     *  - State Provider: City name
     */
    return this.control.valueChanges.pipe(
      // Filtering START
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Filtering END
      // Side-effect: Callstate
      tap(() => this.loading = true),
      /**
       * Stream 2: HTTP Backend API Call
       *  - State Provider: Array of Flights
       */
      switchMap(city => this.load(city)),
      // Side-effect: Callstate
      tap(() => this.loading = false)
      // Tranformation
      // map(flights => any new state)
    );

    /**
     * Flight[]
     *
     * {
     *   callState: 'loaded' as 'inital' | 'loading' | 'loaded' | 'error'
     *   value?: [] as Flight[]
     * }
     */
  }

  private load(city: string): Observable<Flight[]> {
    return this.flightService.find(city, '');
  }
}
