import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentRequestManagementComponent } from './document-request-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';


export const routes: Routes = [
  {
    path: '',
    component: DocumentRequestManagementComponent,
    pathMatch: 'full',
    data: { title: "Request Management" }
  }
];

@NgModule({
  declarations: [
    DocumentRequestManagementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class DocumentRequestManagementModule { }
