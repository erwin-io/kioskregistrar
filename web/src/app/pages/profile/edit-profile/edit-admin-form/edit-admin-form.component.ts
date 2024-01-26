import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Access } from 'src/app/model/access';
import { Admin } from 'src/app/model/admin';
import { Member } from 'src/app/model/member';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { ImageUploadDialogComponent } from 'src/app/shared/image-upload-dialog/image-upload-dialog.component';
import { ImageViewerDialogComponent } from 'src/app/shared/image-viewer-dialog/image-viewer-dialog.component';

@Component({
  selector: 'app-edit-admin-form',
  templateUrl: './edit-admin-form.component.html',
  styleUrls: ['./edit-admin-form.component.scss']
})
export class EditAdminFormComponent {
  profile: Admin;
  form: FormGroup;
  isNew = false;
  isReadOnly = true;
  @Output() submit = new EventEmitter<any>();
  profileFileSource: any;
  profileFile;
  userProfilePicLoaded = false;
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

    this.form = this.formBuilder.group(
      {
        fullName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
        ],
        mobileNumber: [
          '',
          [
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern('^[0-9]*$'),
            Validators.required,
          ],
        ]
      },
    );
    const profile = this.storageService.getLoginProfile();
    this.profile = profile as Admin;
    if(this.profile?.user?.profileFile?.url) {
      this.profileFileSource = this.profile.user.profileFile?.url;
    }
  }


  get f() {
    return this.form.controls;
  }
  get formIsValid() {
    return this.form.valid;
  }
  get formData() {
    return {
      ...this.form.value,
      profileFile: this.profileFile,
    }
  }

  getError(key: string) {
    return this.f[key].errors;
  }

  init(value: Admin) {
    this.form.setValue({
      fullName: value.fullName,
      mobileNumber: value.mobileNumber,
    });
    this.form.markAsPristine();
  }

  async onSubmit() {
    this.submit.emit(this.formData);
  }

  onShowImageViewer() {
    const dialogRef = this.dialog.open(ImageViewerDialogComponent, {
        disableClose: true,
        panelClass: "image-viewer-dialog"
    });
    dialogRef.componentInstance.imageSource = this.profileFileSource;
    dialogRef.componentInstance.canChange = true;

    dialogRef.componentInstance.changed.subscribe(res=> {
      this.userProfilePicLoaded = false;
      this.profileFileSource = res.base64;
      dialogRef.close();

      this.profileFile = {
        fileName: `${moment().format("YYYY-MM-DD-hh-mm-ss")}.png`,
        data: res.base64.toString().split(',')[1]
      };
    })
  }

  onChangeProfile() {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
        disableClose: true,
        panelClass: "image-upload-dialog"
    });
    dialogRef.componentInstance.showCropper = false;
    dialogRef.componentInstance.showWebCam = false;
    dialogRef.componentInstance.doneSelect.subscribe(res=> {
      this.userProfilePicLoaded = false;
      this.profileFileSource = res.base64;
      dialogRef.close();

      this.profileFile = {
        fileName: `${moment().format("YYYY-MM-DD-hh-mm-ss")}.png`,
        data: res.base64.toString().split(',')[1]
      };
    })
  }

  profilePicErrorHandler(event) {
    event.target.src = '../../../../../assets/img/person.png';
  }
}
