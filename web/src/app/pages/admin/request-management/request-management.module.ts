import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestManagementComponent } from './request-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { StatusTrackerComponent } from './request-details/status-tracker/status-tracker.component';
import { RequestFormComponent } from './request-details/request-form/request-form.component';
import { RequestPaymentFormComponent } from './request-details/request-payment-form/request-payment-form.component';
import { RequestAssignFormComponent } from './request-details/request-assign-form/request-assign-form.component';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/admin/request-management/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: RequestManagementComponent,
    data: { title: "Pending", reviewer: true, tab: 0 }
  },
  {
    path: 'to-process',
    pathMatch: 'full',
    component: RequestManagementComponent,
    data: { title: "To process", tab: 1 }
  },
  {
    path: 'processing',
    pathMatch: 'full',
    component: RequestManagementComponent,
    data: { title: "Processing", tab: 2 }
  },
  {
    path: 'to-complete',
    pathMatch: 'full',
    component: RequestManagementComponent,
    data: { title: "To complete", tab: 3 }
  },
  {
    path: 'closed',
    pathMatch: 'full',
    component: RequestManagementComponent,
    data: { title: "Closed", tab: 4 }
  },
  {
    path: 'details/:requestNo',
    component: RequestDetailsComponent,
    data: { title: "Request Details", details: true }
  }
];

@NgModule({
  declarations: [
    RequestManagementComponent,
    RequestDetailsComponent,
    StatusTrackerComponent,
    RequestFormComponent,
    RequestPaymentFormComponent,
    RequestAssignFormComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ]
})
export class RequestManagementModule { }
