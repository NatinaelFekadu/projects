import { ActionReducerMap } from '@ngrx/store';

import * as fromshoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';

export interface AppState {
  shoppingList: fromshoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromshoppingList.shoppingListReducer,
  auth: fromAuth.AuthReducer,
  recipes: fromRecipes.RecipeReducer,
};
