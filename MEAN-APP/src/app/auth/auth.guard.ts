import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const isAuth = inject(AuthService).getIsAuth();
  const router = inject(Router);
  if (!isAuth) {
    router.navigate(['/login']);
  }
  return isAuth;
};
