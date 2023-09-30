import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';

export const authGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const store = inject(Store<fromRoot.State>);
  return store.select(fromRoot.getIsAuth);
};
