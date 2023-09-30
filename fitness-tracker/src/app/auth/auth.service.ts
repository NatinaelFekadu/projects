import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';

// import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.action';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // authChange = new Subject<boolean>();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListner() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(Auth.SET_AUTHENTICATED());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.isAuthenticated = false;
        // this.authChange.next(false);
        this.store.dispatch(Auth.SET_UNAUTHENTICATED());

        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(UI.START_LOADING());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.passoword)

      .then((res) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(UI.STOP_LOADING());
      })
      .catch((err) => {
        this.store.dispatch(UI.STOP_LOADING());
        // this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBar(err.message, undefined, 3000);
      });
  }
  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(UI.START_LOADING());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.passoword)
      .then((res) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(UI.STOP_LOADING());
      })
      .catch((err) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(UI.STOP_LOADING());
        this.uiService.showSnackBar(err.message, undefined, 3000);
      });
  }

  logout() {
    this.afAuth.signOut();
  }
}
