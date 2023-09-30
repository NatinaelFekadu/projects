import { createReducer, on } from '@ngrx/store';
import { START_LOADING, STOP_LOADING } from './ui.actions';
export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false,
};

export const uiReducer = createReducer(
  initialState,
  on(START_LOADING, (state) => {
    return {
      isLoading: true,
    };
  }),
  on(STOP_LOADING, (state) => {
    return {
      isLoading: false,
    };
  })
);

export const getIsLoading = (state: State) => state.isLoading;
