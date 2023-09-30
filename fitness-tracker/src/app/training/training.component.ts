import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from './training.service';
// import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean> | undefined;

  // exerciseSub: Subscription | undefined;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    // this.exerciseSub = this.trainingService.exerciseStarted.subscribe(
    //   (result) => {
    //     if (result) {
    //       this.ongoingTraining = true;
    //     } else {
    //       this.ongoingTraining = false;
    //     }
    //   }
    // );
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }

  // ngOnDestroy(): void {
  //   this.exerciseSub?.unsubscribe();
  // }
}
