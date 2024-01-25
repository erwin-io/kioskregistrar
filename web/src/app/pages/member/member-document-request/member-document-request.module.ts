import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberDocumentRequestComponent } from './member-document-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MemberAuthGuard } from 'src/app/guard/member-auth.guard';
import { MemberRequestItemComponent } from './member-request-item/member-request-item.component';
import { MemberDocumentRequestDetailsComponent } from './member-document-request-details/member-document-request-details.component';
import { RequestManagementModule } from '../../admin/request-management/request-management.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { QrCodeGeneratorModule } from 'src/app/shared/qr-code-generator/qr-code-generator.module';
import { NewMemberDocumentRequestComponent } from './new-member-document-request/new-member-document-request.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pending',
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 0, title: "Pending" },
  },
  {
    path: 'pending',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 0, title: "Pending" },
  },
  {
    path: 'to-pay',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 1, title: "To Pay" },
  },
  {
    path: 'processing',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 2, title: "Processing" },
  },
  {
    path: 'tocomplete',
    component: MemberDocumentRequestComponent,
    canActivate: [MemberAuthGuard],
    data: { admin: false, tab: 3, title: "To Complete" },
  }
];

@NgModule({
  declarations: [
    MemberDocumentRequestComponent,
    MemberRequestItemComponent,
    MemberDocumentRequestDetailsComponent,
    NewMemberDocumentRequestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class MemberDocumentRequestModule { }
