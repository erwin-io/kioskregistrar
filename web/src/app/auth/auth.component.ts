import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  admin = false;
  constructor(private route: ActivatedRoute) {
    this.admin = this.route.snapshot.data && route.snapshot.data["admin"];
  }
}
