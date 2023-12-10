import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberDocumentRequestComponent } from './member-document-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MemberAuthGuard } from 'src/app/guard/member-auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pending',
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 0 },
  },
  {
    path: 'pending',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 0 },
  },
  {
    path: 'to-pay',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 1 },
  },
  {
    path: 'processing',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 2 },
  },
  {
    path: 'tocomplete',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 3 },
  }
];

@NgModule({
  declarations: [
    MemberDocumentRequestComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class MemberDocumentRequestModule { }
