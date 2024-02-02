import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Flight } from '../../logic/model/flight';


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
