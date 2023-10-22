import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportManagementComponent } from './support-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';

export const routes: Routes = [
  {
    path: '',
    component: SupportManagementComponent,
    pathMatch: 'full',
    data: { title: "Support Management" }
  }
];

@NgModule({
  declarations: [
    SupportManagementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class SupportManagementModule { }
