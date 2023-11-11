import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { APP_DATE_FORMATS } from 'src/app/constant/date';
import { AppDateAdapter } from 'src/app/shared/utility/app-date-adapter';

@Component({
  selector: 'app-support-management',
  templateUrl: './support-management.component.html',
  styleUrls: ['./support-management.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
  host: {
    class: "page-component"
  }
})
export class SupportManagementComponent {
  dateRange = new FormGroup({
    start: new FormControl(new Date(2021, 1, 15)),
    end: new FormControl(new Date(2021, 2, 16))
  });
  date = new FormControl(new Date());
  constructor() {
    this.dateRange.valueChanges.subscribe((res)=> {
      const { start, end} = this.dateRange.value;
    })
  }
}
