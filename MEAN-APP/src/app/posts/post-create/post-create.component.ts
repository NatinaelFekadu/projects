import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  // title: string = '';
  // content: string = '';
  // @Output() postCreated = new EventEmitter<{
  //   title: string;
  //   content: string;
  // }>();
  mode: string = 'create';
  post: Post | undefined | null;
  postId: string = '';
  isLoading: boolean = false;
  imagePreview: string = '';
  private authStatusSub: Subscription | undefined;

  form: FormGroup = new FormGroup({
    title: new FormControl(null, { validators: Validators.required }),
    content: new FormControl(null, { validators: Validators.required }),
    image: new FormControl(null, {
      validators: Validators.required,
      asyncValidators: mimeType,
    }),
  });

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.authStatusListener().subscribe(() => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.mode = 'edit';
        const postId = params.get('id');
        if (postId) {
          this.postId = postId;
          this.isLoading = true;
          this.postsService.getPost(postId).subscribe((post) => {
            this.isLoading = false;
            this.post = {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator,
            };
            this.form?.setValue({
              title: this.post?.title,
              content: this.post?.content,
              image: this.post?.imagePath,
            });
          });
        }
      } else {
        this.mode = 'create';
        this.post = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    const post = {
      id: this.postId,
      title: this.form?.value.title,
      content: this.form?.value.content,
      imagePath: '',
      creator: '',
    };
    if (this.mode === 'create') {
      // this.postCreated.emit(post);
      this.postsService.addPost(post, this.form?.value.image);
    } else {
      this.postsService.updatePost(post, this.form?.value.image);
    }
    this.form?.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub?.unsubscribe();
  }
}
