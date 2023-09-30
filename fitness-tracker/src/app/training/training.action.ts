import { createAction, props } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAININGS = createAction(
  '[Training] Set Available Trainings',
  props<{ exercises: Exercise[] }>()
);
export const SET_FINISHED_TRAININGS = createAction(
  '[Training] Set Finished Trainings',
  props<{ exercises: Exercise[] }>()
);
export const START_TRAINING = createAction(
  '[Training] Start Training',
  props<{ id: String }>()
);
export const STOP_TRAINING = createAction('[Training] Set Stop Training');
