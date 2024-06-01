import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UrlManagerComponent } from './url-manager/url-manager.component';
import { CustomSlugComponent } from './custom-slug/custom-slug.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Shortener', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((c) => c.RegisterComponent),
    title: 'Register',
  },
  {
    path: 'manage-urls',
    loadComponent: () =>
      import('./url-manager/url-manager.component').then(
        (c) => c.UrlManagerComponent
      ),
    title: 'URL Manager',
    canActivate: [authGuard],
    children: [
      {
        path: 'create',
        title: 'Create new url',
        loadComponent: () =>
          import('./custom-slug/custom-slug.component').then(
            (c) => c.CustomSlugComponent
          ),
      },
      {
        path: ':id',
        title: (route) => `Edit custom slug ${route.params['id']}`,
        loadComponent: () =>
          import('./custom-slug/custom-slug.component').then(
            (c) => c.CustomSlugComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent
      ),
    title: 'Page not found',
  },
];
