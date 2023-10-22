import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberHomeComponent } from './member-home.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MemberAuthGuard } from 'src/app/guard/member-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MemberHomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [MemberHomeComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class MemberHomeModule { }
