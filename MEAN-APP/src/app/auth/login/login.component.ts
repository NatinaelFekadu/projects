import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription | undefined;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .authStatusListener()
      .subscribe((response) => {
        this.isLoading = false;
      });
  }
  onLogin(formData: NgForm) {
    if (formData.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(formData.value.email, formData.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub?.unsubscribe();
  }
}
