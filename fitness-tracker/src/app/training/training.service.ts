import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

// import {
//   Firestore,
//   collection,
//   getDocs,
//   addDoc,
// } from '@angular/fire/firestore';
// import 'rxjs/add/operator/map';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';
import * as fromTraining from '../training/training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from '../training/training.action';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  // private availableExercises: Exercise[] = [];

  // constructor(private db: Firestore) {}
  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}

  // private runningExercise: Exercise | undefined | null;
  // exerciseStarted = new Subject<Exercise | null>();
  // exercisesChanged = new Subject<Exercise[] | null>();
  // finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  async fetchTrainigs() {
    // const result = collection(this.db, 'availableExercises');
    // const querySnapshot = await getDocs(result);
    // const exercises: Exercise[] = [];
    // querySnapshot.forEach((doc) => {
    //   exercises.push({
    //     id: doc.id,
    //     name: doc.data()['name'],
    //     calories: doc.data()['calories'],
    //     duration: doc.data()['duration'],
    //   });
    // });
    // console.log(exercises);
    // this.availableExercises = exercises;
    // return [...this.availableExercises];
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(UI.START_LOADING());
    this.db;
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            // throw new Error();
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc['id'],
                ...(doc.payload.doc.data() as Object),
              };
            });
          })
        )
        .subscribe({
          next: (exercises) => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(UI.STOP_LOADING());
            this.store.dispatch(
              Training.SET_AVAILABLE_TRAININGS({
                exercises: exercises as Exercise[],
              })
            );
            // this.availableExercises = exercises as Exercise[];
            // this.exercisesChanged.next([...this.availableExercises]);
          },
          error: () => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(UI.STOP_LOADING());
            this.uiService.showSnackBar(
              'Fetching Exercises failed, please try again later',
              undefined,
              3000
            );
            // this.exercisesChanged.next(null);
          },
        })
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({
    //   lastSelected: new Date(),
    // });
    // this.runningExercise = this.availableExercises.find(
    //   (elm) => elm.id === selectedId
    // );

    // this.exerciseStarted.next({ ...this.runningExercise! });
    this.store.dispatch(Training.START_TRAINING({ id: selectedId }));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exe) => {
        this.addDataToDatabase({
          ...exe!,
          date: new Date(),
          state: 'completed',
        });
        // this.runningExercise = null;
        // this.exerciseStarted.next(null);
        this.store.dispatch(Training.STOP_TRAINING());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exe) => {
        this.addDataToDatabase({
          ...exe!,
          duration: exe!.duration * (progress / 100),
          calories: exe!.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });
        // this.runningExercise = null;
        // this.exerciseStarted.next(null);
        this.store.dispatch(Training.STOP_TRAINING());
      });
  }

  async fetchPastExercises() {
    // const ref = collection(this.db, 'finishedExercises');
    // const exercises: Exercise[] = [];
    // const res = await getDocs(ref);
    // res.forEach((doc) => {
    //   exercises.push({
    //     date: new Date((doc.data()['date'] as any).seconds * 1000),
    //     name: doc.data()['name'],
    //     state: doc.data()['state'],
    //     id: doc.data()['id'],
    //     calories: doc.data()['calories'],
    //     duration: doc.data()['duration'],
    //   });
    // });
    // this.finishedExercisesChanged.next(exercises);
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .pipe(
          map((res) => {
            return res.map((exe: any) => {
              return {
                ...exe,
                date: new Date(exe.date.seconds * 1000),
              };
            });
          })
        )
        .subscribe((exercises) => {
          // this.finishedExercisesChanged.next(exercises as Exercise[]);
          this.store.dispatch(
            Training.SET_FINISHED_TRAININGS({ exercises: exercises })
          );
        })
    );
  }
  private addDataToDatabase(exercise: Exercise) {
    //   const ref = collection(this.db, 'finishedExercises');
    //   addDoc(ref, exercise);
    // }
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
