import { Component } from '@angular/core';
import { Admin } from 'src/app/model/admin';
import { Member } from 'src/app/model/member';
import { Users } from 'src/app/model/users';
import { DashboardService } from 'src/app/services/dashboard.service';
import { StorageService } from 'src/app/services/storage.service';
export class DashboardSummaryDetails {
  prio: any;
  total: number;
}
@Component({
  selector: 'app-member-home',
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.scss']
})
export class MemberHomeComponent {
  profile: Admin | Member;
  isLoading = false;
  pending: DashboardSummaryDetails;
  processing: DashboardSummaryDetails;
  toComplete: DashboardSummaryDetails;
  toPay: DashboardSummaryDetails;
  constructor(private storageService: StorageService,
    private dashboardService: DashboardService
    ) {
    this.profile = this.storageService.getLoginProfile();
  }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    const memberId = profile && profile["memberId"] ? profile["memberId"] : 0;
    this.isLoading = true;
    this.dashboardService.getMemberDashboard(memberId).subscribe(res=> {
      this.isLoading = false;
      console.log(res);
      this.pending = res.data.pending;
      this.processing = res.data.processing;
      this.toComplete = res.data.toComplete;
      this.toPay = res.data.toPay;
    })
  }
}
