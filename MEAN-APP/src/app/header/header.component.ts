import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription | undefined;
  isAuth = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authListenerSubs = this.authService
    .authStatusListener()
    .subscribe((isAuth) => {
      this.isAuth = isAuth;
      });
    this.isAuth = this.authService.getIsAuth();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs?.unsubscribe();
  }
}
