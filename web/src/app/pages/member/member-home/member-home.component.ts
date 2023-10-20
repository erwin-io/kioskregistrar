import { Component } from '@angular/core';
import { Users } from 'src/app/model/users';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-member-home',
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.scss']
})
export class MemberHomeComponent {
  user: Users;
  constructor(private storageService: StorageService) {
    this.user = this.storageService.getLoginUser();
  }
}
