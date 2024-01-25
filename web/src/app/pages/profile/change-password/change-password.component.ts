import { Component } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Users } from 'src/app/model/users';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  host: {
    class: "page-component"
  }
})
export class ChangePasswordComponent {
  currentUserCode;
  isProcessing = false;
  error;
  changePasswordForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  user: Users;
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private spinner: SpinnerVisibilityService
  ) {
    const profile = this.storageService.getLoginProfile();
    this.user = profile.user;
    if(!this.user || !this.user.userCode || !this.user.userId) {
      this.router.navigate(['/auth/']);
    }
    this.currentUserCode = this.user.userCode;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.changePasswordForm = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.minLength(6),
            Validators.maxLength(16),
            Validators.required,
          ],
        ],
        confirmPassword: '',
      },
      { validators: this.checkPasswords }
    );
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  get f() {
    return this.changePasswordForm.controls;
  }
  get formIsValid() {
    return this.changePasswordForm.valid;
  }
  get formIsReady() {
    return this.changePasswordForm.valid && this.changePasswordForm.dirty;
  }
  get formData() {
    return this.changePasswordForm.value;
  }

  getError(key: string) {
    if (key === 'confirmPassword') {
      this.formData.confirmPassword !== this.formData.password
        ? this.f[key].setErrors({ notMatched: true })
        : this.f[key].setErrors(null);
    }
    return this.f[key].errors;
  }

  onSubmitChangePassword() {
    if (this.changePasswordForm.invalid || this.changePasswordForm.invalid) {
      return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update your password?';
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
        const params = this.formData;
        this.isProcessing = true;
        let res = await this.authService.login({
          userName: this.user.userName,
          password: params.currentPassword,
        }, this.user.userType.toUpperCase() as any).toPromise();
        if(!res.success) {
          this.isProcessing = false;
          this.f["currentPassword"].setErrors( { invalid: true });
          this.f["currentPassword"].markAllAsTouched();
          dialogRef.close();
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          return;
        }
        this.f["currentPassword"].setErrors(null);
        if(res.data.user.userType.toUpperCase() === "ADMIN") {
          res = await this.userService.resetAdminPassword(this.currentUserCode, params).toPromise();
        } else {
          res = await this.userService.resetMemberPassword(this.currentUserCode, params).toPromise();
        }

        if (res.success) {
          this.snackBar.open('Password updated!', 'close', {
            panelClass: ['style-success'],
          });
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
          window.location.reload();
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
