import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(formData: NgForm) {
    if (formData.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(formData.value.email, formData.value.password);
    formData.resetForm();
  }

  ngOnDestroy(): void {
    this.authStatusSub?.unsubscribe();
  }
}
