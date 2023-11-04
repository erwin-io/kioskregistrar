import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestTypeComponent } from './request-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RequestTypeDetailsComponent } from './request-type-details/request-type-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { RequestRequirementsComponent } from './request-requirements/request-requirements.component';
import { RequestTypeFormComponent } from './request-type-form/request-type-form.component';

export const routes: Routes = [
  {
    path: '',
    component: RequestTypeComponent,
    pathMatch: 'full',
    data: { title: "Request Type" }
  },
  {
    path: 'add',
    component: RequestTypeDetailsComponent,
    data: { title: "Add", details: true, isNew: true}
  },
  {
    path: ':requestTypeId',
    component: RequestTypeDetailsComponent,
    data: { title: "Request Type", details: true }
  },
  {
    path: ':requestTypeId/edit',
    component: RequestTypeDetailsComponent,
    data: { title: "Request Type", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    RequestTypeComponent,
    RequestTypeDetailsComponent,
    RequestRequirementsComponent,
    RequestTypeFormComponent
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
export class RequestTypeModule { }
