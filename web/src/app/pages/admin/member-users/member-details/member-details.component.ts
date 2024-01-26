import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Access } from 'src/app/model/access';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { generateSchoolYear } from 'src/app/shared/utility/utility';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  host: {
    class: 'page-component',
  },
})
export class MemberDetailsComponent {
  id;
  isNew = false;
  pageAccess: Access = {
    view: true,
    modify: false,
  };

  isReadOnly = true;

  error;
  isLoading = false;

  memberForm: FormGroup;
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.id = this.route.snapshot.paramMap.get('memberCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
    this.memberForm = this.formBuilder.group({
      fullName: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      mobileNumber: ['', [ Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$'), Validators.required]],
      email: ['', [ Validators.email, Validators.required]],
      userName: [''],
      birthDate: [null, [ Validators.required]],
      gender: ['', [ Validators.required]],
      address: ['', [ Validators.required]],
      courseTaken: ['', [ Validators.required]],
      major: [''],
      isAlumni: [false, [ Validators.required]],
      schoolYearLastAttended: ['', [ Validators.required]],
      primarySchoolName: ['', [ Validators.required]],
      primarySyGraduated: ['', [ Validators.required]],
      secondarySchoolName: ['', [ Validators.required]],
      secondarySyGraduated: ['', [ Validators.required]],
    });
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  get f() {
    return this.memberForm.controls;
  }
  get formIsValid() {
    return this.memberForm.valid;
  }
  get formData() {
    return this.memberForm.value;
  }

  get yearList() {
    return generateSchoolYear(1950, false);
  }

  get pairedYearList() {
    return generateSchoolYear(1950, true);
  }

  ngOnInit(): void {
    this.initForm();
  }

  async initForm() {
    const res = await this.userService.getMemberById(this.id).toPromise();
    if (res.success) {
      this.f['fullName'].setValue(res.data.fullName);
      this.f['mobileNumber'].setValue(res.data.mobileNumber);
      this.f['email'].setValue(res.data.email);
      this.f['userName'].setValue(res.data.user.userName);
      this.f['birthDate'].setValue(res.data.birthDate);
      this.f['gender'].setValue(res.data.gender);
      this.f['address'].setValue(res.data.address);
      this.f['courseTaken'].setValue(res.data.courseTaken);
      this.f['major'].setValue(res.data.major);
      this.f['isAlumni'].setValue(res.data.isAlumni);
      this.f['schoolYearLastAttended'].setValue(res.data.schoolYearLastAttended);
      this.f['primarySchoolName'].setValue(res.data.primarySchoolName);
      this.f['primarySyGraduated'].setValue(res.data.primarySyGraduated);
      this.f['secondarySchoolName'].setValue(res.data.secondarySchoolName);
      this.f['secondarySyGraduated'].setValue(res.data.secondarySyGraduated);

      this.f['userName'].disable();
      if (this.isReadOnly) {
        this.memberForm.disable();
      }
    } else {
      this.error = Array.isArray(res.message) ? res.message[0] : res.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
    }
  }

  getError(key: string) {
    if (key === 'confirmPassword') {
      this.formData.confirmPassword !== this.formData.password
        ? this.f[key].setErrors({ notMatched: true })
        : this.f[key].setErrors(null);
    }
    return this.f[key].errors;
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  onSubmit() {
    if (this.memberForm.invalid) {
      return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save member?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
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
        this.isProcessing = true;
        const params = this.formData;
        let res = await this.userService.updateMember(this.id, params).toPromise();
        if (res.success) {
          this.snackBar.open('Updated!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/admin/members/' + res.data.memberCode]);
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
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }
}
