import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/model/admin';
import { Member } from 'src/app/model/member';
import { EditAdminFormComponent } from './edit-admin-form/edit-admin-form.component';
import { EditMemberFormComponent } from './edit-member-form/edit-member-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  host: {
    class: "page-component"
  }
})
export class EditProfileComponent implements AfterViewInit {
  profile: Admin | Member;
  isProcessing = false;
  currentUserCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;
  @ViewChild('adminForm', { static: true}) adminFormComponent: EditAdminFormComponent;
  @ViewChild('memberForm', { static: true}) memberFormComponent: EditMemberFormComponent;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService) {
      this.profile = this.storageService.getLoginProfile();

  }

  ngAfterViewInit() {
    this.initDetails();
  }

  initDetails() {
    if(this.profile.user.userType === "ADMIN") {
      this.adminFormComponent.init(this.profile as any);
      this.adminFormComponent.submit.subscribe(res=> {
        if (!this.adminFormComponent.formIsValid) {
          return;
        }
        this.update(res);
      })

    } else {
      this.memberFormComponent.init(this.profile as any);
      this.memberFormComponent.submit.subscribe(res=> {
        if (!this.memberFormComponent.formIsValid) {
          return;
        }

        this.update(res);
      })
    }
  }

  update(params) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update your profile?';
    dialogData.confirmButton = {
      visible: true,
      text: 'Yes, Update now',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;
    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res;
        if(this.profile.user.userType.toUpperCase() === "ADMIN") {
          res = await this.userService.updateAdmin(this.profile["adminCode"], params).toPromise();
        } else {
          res = await this.userService.updateMember(this.profile["memberCode"], params).toPromise();
        }
        if(res.success) {
          this.storageService.saveLoginProfile(res.data);
          this.snackBar.open('Profile updated!', 'close', {
            panelClass: ['style-success'],
          });
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      }
      catch(ex) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }
}
