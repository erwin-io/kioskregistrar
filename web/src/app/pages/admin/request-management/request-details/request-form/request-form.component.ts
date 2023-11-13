import { Component, Input } from '@angular/core';
import { Request } from 'src/app/model/request'
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent {
  @Input() requestDetails: Request = {} as any;
  constructor() {
  }
}
