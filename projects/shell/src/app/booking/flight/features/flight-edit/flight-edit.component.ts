import { AsyncPipe } from '@angular/common';
import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { routerFeature } from '../../../../shared/+state/router.feature';
import { ticketFeature } from '../../logic/+state/tickets.reducer';
import { initialFlight } from '../../logic/model/flight';


@Component({
  selector: 'app-flight-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule, AsyncPipe
  ],
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent {
  @Input() flight = initialFlight;

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flight'].previousValue !== changes['flight'].currentValue) {
      this.editForm.patchValue(this.flight);
    }
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
