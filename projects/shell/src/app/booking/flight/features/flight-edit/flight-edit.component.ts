import { AsyncPipe } from '@angular/common';
import { Component, Input, SimpleChanges, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { routerFeature } from '../../../../shared/+state/router.feature';
import { ticketFeature } from '../../logic/+state/tickets.reducer';
import { Flight, initialFlight } from '../../logic/model/flight';


@Component({
  selector: 'app-flight-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule, AsyncPipe
  ],
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent {
  flight = input.required<Flight>();

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });

  constructor() {
    effect(() => {
      this.editForm.patchValue(this.flight());
      console.log(this.flight());
    });
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
