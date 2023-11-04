import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberUsersComponent } from './member-users.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { DataTableModule } from "../../../shared/data-table/data-table.module";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MemberUsersComponent,
    data: { title: "Members"}
  },
  {
    path: ':userId',
    component: MemberDetailsComponent,
    data: { title: "Members", details: true }
  },
  {
    path: ':userId/edit',
    component: MemberDetailsComponent,
    data: { title: "Members", details: true, edit: true }
  },
];

@NgModule({
    declarations: [
        MemberUsersComponent,
        MemberDetailsComponent
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
export class MemberUsersModule { }

