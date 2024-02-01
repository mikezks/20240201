import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, share, tap, timer } from 'rxjs';

@Component({
  selector: 'app-flight-typeahead',
  standalone: true,
  imports: [
    AsyncPipe, NgIf
  ],
  templateUrl: './flight-typeahead.component.html',
  styleUrl: './flight-typeahead.component.scss'
})
export class FlightTypeaheadComponent implements OnDestroy {
  timer$ = timer(0, 2_000).pipe(
    tap(value => console.log('Producer', value)),
    share()
  );
  subscription = new Subscription();

  constructor() {
    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
