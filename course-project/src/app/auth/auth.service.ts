import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment.development';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registerd?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpiratonTime: any;
  // user = new BehaviorSubject<User>(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  // autoLogin() {
  //   const userData: {
  //     email: string;
  //     id: string;
  //     _token: string;
  //     _tokenExpirationDate: string;
  //   } = JSON.parse(localStorage.getItem('userData'));

  //   if (!userData) {
  //     return;
  //   }
  //   const loadedUser = new User(
  //     userData.email,
  //     userData.id,
  //     userData._token,
  //     new Date(userData._tokenExpirationDate)
  //   );

  //   if (loadedUser.token) {
  //     // this.user.next(loadedUser);
  //     this.store.dispatch(
  //       new AuthActions.AuthSuccess({
  //         email: loadedUser.email,
  //         localId: loadedUser.id,
  //         idToken: loadedUser.token,
  //         expirationDate: new Date(userData._tokenExpirationDate),
  //       })
  //     );
  //     const expirationDuration =
  //       new Date(userData._tokenExpirationDate).getTime() -
  //       new Date().getTime();
  //     this.autoLoout(expirationDuration);
  //   }
  // }

  // signUp(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
  //         environment.firebaseAPIkey,
  //       {
  //         email,
  //         password,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((resData) => {
  //         this.handleAuthentication(resData);
  //       })
  //     );
  // }

  // private handleAuthentication(resData: AuthResponseData) {
  //   const expirationDate = new Date(
  //     new Date().getTime() + +resData.expiresIn * 1000
  //   );
  //   const user = new User(
  //     resData.email,
  //     resData.localId,
  //     resData.idToken,
  //     expirationDate
  //   );
  //   // this.user.next(user);
  //   this.store.dispatch(
  //     new AuthActions.AuthSuccess({
  //       email: resData.email,
  //       localId: resData.localId,
  //       idToken: resData.idToken,
  //       expirationDate: expirationDate,
  //     })
  //   );
  //   this.autoLoout(+resData.expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(user));
  // }
  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponseData>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  //         environment.firebaseAPIkey,
  //       {
  //         email,
  //         password,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((resData) => {
  //         this.handleAuthentication(resData);
  //       })
  //     );
  // }

  // logout() {
  //   // this.user.next(null);
  //   // this.store.dispatch(new AuthActions.Logout());
  //   // this.router.navigate(['/auth']);
  //   localStorage.removeItem('userData');
  //   if (this.tokenExpiratonTime) {
  //     clearTimeout(this.tokenExpiratonTime);
  //   }
  // }

  setLogutTimer(expirationDuration: number) {
    this.tokenExpiratonTime = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpiratonTime) {
      clearTimeout(this.tokenExpiratonTime);
      this.tokenExpiratonTime = null;
    }
  }

  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = 'An Unknown Error Occured!';
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'This email exists already!';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exist!';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'This password is not correct!';
  //       break;
  //   }
  //   return throwError(errorMessage);
  // }
}
