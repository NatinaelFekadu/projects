import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | undefined | null;
  private authStatus = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  authStatusListener() {
    return this.authStatus.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post(BACKEND_URL + 'signup', authData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.authStatus.next(false);
      },
    });
  }
  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe({
        next: (response) => {
          this.token = response.token;
          this.setAuthTimer(response.expiresIn);
          this.userId = response.userId;
          if (response.token) {
            this.isAuth = true;
            this.authStatus.next(true);
            this.router.navigate(['/']);
          }
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + response.expiresIn * 1000
          );
          this.saveAuthData(response.token, expirationDate, this.userId);
        },
        error: (error) => {
          this.authStatus.next(false);
        },
      });
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuth;
  }

  autoLogin() {
    const tokenInfo = this.getAuthData();
    const now = new Date();
    if (tokenInfo?.expiresIn.getTime()) {
      const expiresIn = tokenInfo.expiresIn.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = tokenInfo?.token;
        this.isAuth = true;
        this.userId = tokenInfo.userId;
        this.authStatus.next(true);
        this.setAuthTimer(expiresIn / 1000);
      }
    }
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuth = false;
    this.authStatus.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string | null
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationDate.toISOString());
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiresIn');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expirationDate),
      userId,
    };
  }
}
