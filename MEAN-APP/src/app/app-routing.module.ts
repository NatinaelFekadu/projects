import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { authGuard } from './auth/auth.guard';
import { AuthRoutingModule } from './auth/auth-routing.module';

const appRoute: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [authGuard] },
  {
    path: 'edit/:id',
    component: PostCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoute), AuthRoutingModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
