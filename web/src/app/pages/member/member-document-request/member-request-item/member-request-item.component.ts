import { Component, Input } from '@angular/core';
import { Request } from 'src/app/model/request';

@Component({
  selector: 'app-member-request-item',
  templateUrl: './member-request-item.component.html',
  styleUrls: ['./member-request-item.component.scss']
})
export class MemberRequestItemComponent {
  @Input() requestDetails: Request;
}
