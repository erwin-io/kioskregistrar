import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from './member-document-request.module'
import { Location } from '@angular/common';

@Component({
  selector: 'app-member-document-request',
  templateUrl: './member-document-request.component.html',
  styleUrls: ['./member-document-request.component.scss']
})
export class MemberDocumentRequestComponent {
  selectedTabIndex = 0;
  constructor(private route: ActivatedRoute, private router: Router, private location: Location) {
    this.selectedTabIndex = this.route.snapshot.data && this.route.snapshot.data["tab"];
  }
  onTabChanged(event) {
    const route = routes.find(x=>x.data["tab"] === event.index && x.path !== "");
    if(route) {
      // this.router.navigate([`/member/document-request/${route.path}`]);
      this.location.replaceState(`/member/document-request/${route.path}`)
    }
  }
}
