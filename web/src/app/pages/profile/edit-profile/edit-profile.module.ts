import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { EditAdminFormComponent } from './edit-admin-form/edit-admin-form.component';
import { EditMemberFormComponent } from './edit-member-form/edit-member-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EditProfileComponent,
    data: { title: "Edit Profile", details: true }
  },
];



@NgModule({
  declarations: [
    EditProfileComponent,
    EditAdminFormComponent,
    EditMemberFormComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class EditProfileModule { }
