import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UrlManagerComponent } from './url-manager/url-manager.component';
import { CustomSlugComponent } from './custom-slug/custom-slug.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Shortener' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  {
    path: 'manage-urls',
    component: UrlManagerComponent,
    title: 'URL Manager',
    children: [
      {
        path: 'create',
        title: 'Create new url',
        component: CustomSlugComponent,
      },
      {
        path: ':id',
        title: (route) => `Edit custom slug ${route.params['id']}`,
        component: CustomSlugComponent,
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent, title: 'Page not found' },
];
