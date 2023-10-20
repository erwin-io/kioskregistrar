import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { MemberComponent } from './pages/member/member.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'member', data: { admin: false }, },
    { path: 'member', pathMatch: 'full', redirectTo: 'member/home', data: { admin: false }, },
    { path: 'auth', pathMatch: 'full', redirectTo: 'auth/member/login', data: { admin: false }, },
    { path: 'auth/member', pathMatch: 'full', redirectTo: 'auth/member/login', data: { admin: false }, },

    { path: 'admin', pathMatch: 'full', redirectTo: 'admin/dashboard', data: { admin: true }, },
    { path: 'auth/admin', pathMatch: 'full', redirectTo: 'auth/admin/login', data: { admin: true }, },

    { path: 'profile', pathMatch: 'full', redirectTo: 'profile/edit-profile' },

    { path: 'admin',
      component: AdminComponent,
      canActivate: [AuthGuard],
      data: { admin: true },
      children: [
        { 
          path: 'dashboard', 
          canActivate: [AuthGuard], 
          data: { admin: true },
          loadChildren: () => import('./pages/admin/home/admin-home.module').then(m => m.AdminHomeModule) },
      ]
    },
    { path: 'member',
      component: MemberComponent,
      canActivate: [AuthGuard],
      data: { admin: false },
      children: [
        { 
          path: 'home', canActivate: [AuthGuard], data: { admin: false }, loadChildren: () => import('./pages/member/member-home/member-home.module').then(m => m.MemberHomeModule)
        },
        {
          path: 'document-request', canActivate: [AuthGuard], data: { admin: false }, loadChildren: () => import('./pages/member/member-document-request/member-document-request.module').then(m => m.MemberDocumentRequestModule)
        },
        {
          path: 'archived-documents', canActivate: [AuthGuard], data: { admin: false }, loadChildren: () => import('./pages/member/member-archived-documents/member-archived-documents.module').then(m => m.MemberArchivedDocumentsModule)
        }
      ]
    },
    { path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'edit-profile', canActivate: [AuthGuard], loadChildren: () => import('./pages/profile/edit-profile/edit-profile.module').then(m => m.EditProfileModule) },
        { path: 'password-and-security', canActivate: [AuthGuard], loadChildren: () => import('./pages/profile/password-and-security/password-and-security.module').then(m => m.PasswordAndSecurityModule) },
      ]
    },
    { path: 'auth/admin',
      component: AuthComponent,
      children: [
        { 
          path: 'login', data: { admin: true }, loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) 
        },
      ]
    },
    { path: 'auth/member',
      component: AuthComponent,
      data: { admin: false },
      children: [
        { 
          path: 'login', data: { admin: false }, loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) 
        },
        { 
          path: 'register', data: { admin: false }, loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule) 
        },
      ]
    },
    {
      path:"**", component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
