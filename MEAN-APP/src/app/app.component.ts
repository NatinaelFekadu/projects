import { Component, OnInit, Output, inject } from '@angular/core';

import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'MEAN-APP';
  // posts: Array<Post> = [];
  // onAddPost(post: Post) {
  //   this.posts.push(post);
  //   console.log(this.posts);
  // }
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
