import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
// import { AuthService } from './auth.service';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';

export const authGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  const store = inject(Store<fromApp.AppState>);
  const router = inject(Router);
  return store.select('auth').pipe(
    map((authState) => authState.user),
    take(1),
    map((user) => {
      const isAuth = !!user;
      if (isAuth) {
        return true;
      }
      return router.createUrlTree(['/auth']);
    })
  );
};
