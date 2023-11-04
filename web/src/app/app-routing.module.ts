import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAuthGuard } from './guard/admin-auth.guard';
import { MemberAuthGuard } from './guard/member-auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { MemberComponent } from './pages/member/member.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'member/home' },
  { path: 'member', pathMatch: 'full', redirectTo: 'member/home' },
  { path: 'auth', pathMatch: 'full', redirectTo: 'auth/member/login' },
  { path: 'auth/member', pathMatch: 'full', redirectTo: 'auth/member/login' },

  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  { path: 'auth/admin', pathMatch: 'full', redirectTo: 'auth/admin/login' },

  {
    path: 'profile',
    pathMatch: 'full',
    redirectTo: 'profile/edit-profile',
    title: 'Profile',
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [AdminAuthGuard],
        data: { admin: true, title: 'Dashboard' },
        loadChildren: () =>
          import('./pages/admin/home/admin-home.module').then(
            (m) => m.AdminHomeModule
          ),
      },
      {
        path: 'document-request-management',
        canActivate: [AdminAuthGuard],
        data: { admin: true, title: 'Request Management' },
        loadChildren: () =>
          import(
            './pages/admin/document-request-management/document-request-management.module'
          ).then((m) => m.DocumentRequestManagementModule),
      },
      {
        path: 'request-type',
        canActivate: [AdminAuthGuard],
        data: { admin: true, title: 'Request Type' },
        loadChildren: () =>
          import('./pages/admin/request-type/request-type.module').then(
            (m) => m.RequestTypeModule
          ),
      },
      {
        path: 'support-management',
        canActivate: [AdminAuthGuard],
        data: { admin: true, title: 'Support Management' },
        loadChildren: () =>
          import(
            './pages/admin/support-management/support-management.module'
          ).then((m) => m.SupportManagementModule),
      },
      {
        path: 'admin-access',
        canActivate: [AdminAuthGuard],
        data: { admin: true, title: 'Admin access' },
        loadChildren: () =>
          import('./pages/admin/admin-access/admin-access.module').then((m) => m.UsersModule),
      },
      {
        path: 'members',
        canActivate: [AdminAuthGuard],
        data: { admin: true, title: 'Members' },
        loadChildren: () =>
          import('./pages/admin/member-users/member-users.module').then((m) => m.MemberUsersModule),
      },
    ],
  },
  {
    path: 'member',
    component: MemberComponent,
    canActivate: [MemberAuthGuard],
    children: [
      {
        path: 'home',
        canActivate: [MemberAuthGuard],
        loadChildren: () =>
          import('./pages/member/member-home/member-home.module').then(
            (m) => m.MemberHomeModule
          ),
      },
      {
        path: 'document-request',
        canActivate: [MemberAuthGuard],
        loadChildren: () =>
          import(
            './pages/member/member-document-request/member-document-request.module'
          ).then((m) => m.MemberDocumentRequestModule),
      },
      {
        path: 'archived-documents',
        canActivate: [MemberAuthGuard],
        loadChildren: () =>
          import(
            './pages/member/member-archived-documents/member-archived-documents.module'
          ).then((m) => m.MemberArchivedDocumentsModule),
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('./pages/profile/edit-profile/edit-profile.module').then(
            (m) => m.EditProfileModule
          ),
      },
      {
        path: 'password-and-security',
        loadChildren: () =>
          import(
            './pages/profile/password-and-security/password-and-security.module'
          ).then((m) => m.PasswordAndSecurityModule),
      },
    ],
  },
  {
    path: 'auth/admin',
    component: AuthComponent,
    data: { admin: true },
    children: [
      {
        path: 'login',
        data: { admin: true },
        loadChildren: () =>
          import('./auth/login/login.module').then((m) => m.LoginModule),
      },
    ],
  },
  {
    path: 'auth/member',
    component: AuthComponent,
    data: { admin: false },
    children: [
      {
        path: 'login',
        data: { admin: false },
        loadChildren: () =>
          import('./auth/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        data: { admin: false },
        loadChildren: () =>
          import('./auth/register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
    ],
  },
  {
    path: 'admin/no-access',
    component: NoAccessComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
