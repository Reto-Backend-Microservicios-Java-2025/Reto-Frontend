import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/sign-in',
    loadComponent: () => import('./features/auth/components/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'auth/sign-up',
    loadComponent: () => import('./features/auth/components/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/components/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/clients/components/client-list.component').then(m => m.ClientListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/create',
    loadComponent: () => import('./features/clients/components/client-create.component').then(m => m.ClientCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:encryptedCode',
    loadComponent: () => import('./features/clients/components/client-details.component').then(m => m.ClientDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/components/product-list.component').then(m => m.ProductListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
