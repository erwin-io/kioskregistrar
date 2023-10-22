import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/shared/material/material.module';

export const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    pathMatch: 'full',
    data: { title: "Users" }
  }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class UsersModule { }
