import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';

import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
} from './training.action';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise | null | undefined;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}
const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export const trainingReducer = createReducer(
  initialState,
  on(SET_AVAILABLE_TRAININGS, (state, { exercises }) => {
    return {
      ...state,
      availableExercises: exercises,
    };
  }),
  on(SET_FINISHED_TRAININGS, (state, { exercises }) => {
    return {
      ...state,
      finishedExercises: exercises,
    };
  }),
  on(START_TRAINING, (state, { id }) => {
    const availableExercises = [...state.availableExercises];
    return {
      ...state,
      activeTraining: availableExercises.find((exe) => exe.id === id),
    };
  }),
  on(STOP_TRAINING, (state) => {
    return {
      ...state,
      activeTraining: null,
    };
  })
);

export const getTrainingState =
  createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getFinishedExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);
export const getIsTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining != null
);
