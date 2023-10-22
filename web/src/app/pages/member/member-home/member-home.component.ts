import { Component } from '@angular/core';
import { Admin } from 'src/app/model/admin';
import { Member } from 'src/app/model/member';
import { Users } from 'src/app/model/users';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-member-home',
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.scss']
})
export class MemberHomeComponent {
  profile: Admin | Member;
  constructor(private storageService: StorageService) {
    this.profile = this.storageService.getLoginProfile();
  }
}
