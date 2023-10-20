import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberDocumentRequestComponent } from './member-document-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';


export const routes: Routes = [
  {
    path: '',
    component: MemberDocumentRequestComponent,
    pathMatch: 'full'
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
