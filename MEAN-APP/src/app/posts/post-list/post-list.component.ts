import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  postsSub: Subscription | undefined;
  // posts = [
  //   { title: 'First Post', content: "The first post's content" },
  //   { title: 'Second Post', content: "The second post's content" },
  //   { title: 'Thrid Post', content: "The third post's content" },
  // ];

  // @Input() posts: Array<{ title: string; content: string }> = [];
  posts: Array<Post> = [];
  isLoading = false;
  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isAuth = false;
  userId: string | null = null;
  private authSub: Subscription | undefined;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostChangedListener()
      .subscribe(({ posts, postsCount }) => {
        this.isLoading = false;
        this.posts = posts;
        this.totalPosts = postsCount;
        this.userId = this.authService.getUserId();
      });
    this.isAuth = this.authService.getIsAuth();
    this.authService.authStatusListener().subscribe((isAuth) => {
      this.isAuth = isAuth;
    });
  }

  onDeletePost(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe({
      next:() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      error:() => {
        this.isLoading = false;
      }
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postsSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }
}
