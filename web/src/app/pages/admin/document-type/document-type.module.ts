import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentTypeComponent } from './document-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';

export const routes: Routes = [
  {
    path: '',
    component: DocumentTypeComponent,
    pathMatch: 'full',
    data: { title: "Document Type" }
  }
];


@NgModule({
  declarations: [
    DocumentTypeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class DocumentTypeModule { }
