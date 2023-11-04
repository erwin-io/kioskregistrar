import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAccessComponent } from './admin-access.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { AdminAccessDetailsComponent } from './admin-access-details/admin-access-details.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataTableModule } from "../../../shared/data-table/data-table.module";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminAccessComponent,
    data: { title: "Admin access"}
  },
  {
    path: 'add',
    component: AdminAccessDetailsComponent,
    data: { title: "Add", details: true, isNew: true}
  },
  {
    path: ':userId',
    component: AdminAccessDetailsComponent,
    data: { title: "Admin access", details: true }
  },
  {
    path: ':userId/edit',
    component: AdminAccessDetailsComponent,
    data: { title: "Admin access", details: true, edit: true }
  },
];

@NgModule({
    declarations: [AdminAccessComponent, AdminAccessDetailsComponent],
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
export class UsersModule { }
