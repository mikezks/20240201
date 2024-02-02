import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
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
  private store = inject(Store);
  protected id$ = this.store.select(routerFeature.selectRouteParams).pipe(
    map(params => params['id'] || 0)
  );
  @Input() flight = initialFlight;

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });

  constructor() {
    this.store.select(ticketFeature.selectCurrentFlight).subscribe(
      flight => this.editForm.patchValue(flight)
    );
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
