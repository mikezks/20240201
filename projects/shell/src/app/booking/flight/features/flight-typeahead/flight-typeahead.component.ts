import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, UnaryFunction, catchError, debounceTime, distinctUntilChanged, filter, of, pipe, switchMap, takeUntil, tap, timer } from 'rxjs';
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
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  private flightService = inject(FlightService);
  private destroyRef = inject(DestroyRef);

  private destroy$ = new Subject<void>();
  protected control = new FormControl('', { nonNullable: true });
  protected flights$ = this.initFlightsStream();
  protected loading = false;

  constructor() {
    // setTimeout(() => this.destroy$.next(), 3_000);
    this.destroyRef.onDestroy(
      () => console.log('Typeahead DESTROYED')
    );
  }

  ngOnInit(): void {
    timer(0, 1_000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(console.log);
  }

  private initFlightsStream(): Observable<Flight[]> {
    const customFilter = <T>(
      filterFn: (value: T) => boolean,
      debounceTimeValue: number
    ): UnaryFunction<
      Observable<T>,
      Observable<T>
    > => pipe(
      filter(filterFn),
      debounceTime(debounceTimeValue),
      distinctUntilChanged(),
    );

    /**
     * Stream 1: Input Form Changes
     *  - Trigger
     *  - State Provider: City name
     */
    return this.control.valueChanges.pipe(
      // Filtering START
      customFilter(
        city => city.length > 2,
        300
      ),
      // Filtering END
      // Side-effect: Callstate
      tap(() => this.loading = true),
      /**
       * Stream 2: HTTP Backend API Call
       *  - State Provider: Array of Flights
       */
      switchMap(city => {
        if (city.length > 2) {
          return this.load(city).pipe(
            catchError(() => of([]))
          );
        }
        return of([]);
      }),
      // Side-effect: Callstate
      tap(() => this.loading = false),
      // Tranformation
      // map(flights => any new state)
      // takeUntil(this.destroy$)
      takeUntilDestroyed()
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

  ngOnDestroy(): void {
    this.destroy$.next();
    // this.destroy$.complete();
  }
}
