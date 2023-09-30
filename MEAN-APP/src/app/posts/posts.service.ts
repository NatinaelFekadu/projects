import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from '../../environments/environment.development';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsChanged = new Subject<{ posts: Post[]; postsCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)

      .subscribe((resData) => {
        // const id = resData.post.id;
        // post.id = id;
        // this.posts.push(post);
        // this.postsChanged.next(this.posts.slice());
        this.router.navigate(['/']);
      });
  }

  getPostChangedListener() {
    return this.postsChanged.asObservable();
  }
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{
        message: string;
        posts: Array<{
          _id: string;
          title: string;
          content: string;
          imagePath: string;
          creator: string;
        }>;
        totalPosts: number;
      }>(BACKEND_URL + queryParams)
      .pipe(
        map((postData) => {
          return {
            post: postData.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            totalPosts: postData.totalPosts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.post;
        this.postsChanged.next({
          posts: this.posts.slice(),
          postsCount: postData.totalPosts,
        });
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  updatePost(post: Post, image: File) {
    const postId = post.id;
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title),
        postData.append('content', post.content),
        postData.append('image', image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: typeof image === 'string' ? image : '',
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + postId, postData).subscribe(() => {
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex(
      //   (post) => post.id === postId
      // );
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // this.postsChanged.next(this.posts.slice());
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id);
    // .subscribe(() => {
    //   const updatedPosts = this.posts.filter((post) => post.id !== id);
    //   this.posts = updatedPosts;
    //   this.postsChanged.next(this.posts.slice());
    // });
  }
}
