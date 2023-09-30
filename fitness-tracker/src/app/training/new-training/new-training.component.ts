import { Component, OnInit, OnDestroy } from '@angular/core';
// import {
//   Firestore,
//   collection,
//   collectionSnapshots,
//   onSnapshot,
//   doc,
//   docSnapshots,
// } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/shared/ui.service';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  availableExercises$: Observable<Exercise[]> | undefined;
  // exeSub: Subscription | undefined;
  // loadingSub: Subscription | undefined;
  isLoading$: Observable<boolean> | undefined;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    this.availableExercises$ = this.store.select(
      fromTraining.getAvailableExercises
    );
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSub = this.uiService.loadingStateChanged.subscribe(
    //   (isLoding) => (this.isLoading = isLoding)
    // );
    // this.exeSub = this.trainingService.exercisesChanged.subscribe(
    //   (exe) => (this.availableExercises = exe)
    // );
    this.fetchExercises();
    // const result = doc(this.db, 'availableExercises/1');
    // console.log(result);

    // docSnapshots(result).subscribe((val) => console.log(val));

    // collectionSnapshots(result).subscribe((val) => console.log(val));
    // this.trainingService.fetchTrainigs().then((res) => {
    //   this.availableExercises = res;
    // });
  }

  fetchExercises() {
    this.trainingService.fetchTrainigs();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
  // ngOnDestroy(): void {
  // this.exeSub?.unsubscribe();
  // this.loadingSub?.unsubscribe();
  // }
}
