import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberArchivedDocumentsComponent } from './member-archived-documents.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MemberAuthGuard } from 'src/app/guard/member-auth.guard';


export const routes: Routes = [
  {
    path: '',
    component: MemberArchivedDocumentsComponent,
    canActivate: [MemberAuthGuard],
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    MemberArchivedDocumentsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class MemberArchivedDocumentsModule { }
