import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Access } from 'src/app/model/access';
import { Admin } from 'src/app/model/admin';
import { ApiResponse } from 'src/app/model/api-response.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';

@Component({
  selector: 'app-admin-access-details',
  templateUrl: './admin-access-details.component.html',
  styleUrls: ['./admin-access-details.component.scss'],
  host: {
    class: 'page-component',
  },
})
export class AdminAccessDetailsComponent implements OnInit {
  currentAdminCode:string;
  id;
  isNew = false;
  pageAccess: Access = {
    view: true,
    modify: false,
  };

  isReadOnly = true;

  error;
  isLoading = false;

  adminAccessForm: FormGroup;
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  maxDate = moment(new Date().getFullYear() - 18).format('YYYY-MM-DD');

  displayedColumns = ['page', 'view', 'modify', 'rights'];
  accessDataSource = new MatTableDataSource<Access>();

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
    this.id = this.route.snapshot.paramMap.get('adminCode');
    const profile = this.storageService.getLoginProfile();
    this.currentAdminCode = profile["adminCode"];
    this.isReadOnly = !edit && !isNew;
    if(!isNew && edit && edit !== undefined && this.currentAdminCode === this.id) {
      this.router.navigate(['/admin/admin-access/' + this.id]);
    }
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
    this.accessDataSource = new MatTableDataSource([] as Access[]);
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  get f() {
    return this.adminAccessForm.controls;
  }
  get formIsValid() {
    return this.adminAccessForm.valid;
  }
  get formData() {
    return this.adminAccessForm.value;
  }

  get accessCheckBox() {
    return {
      view: {
        all:
          this.formData.access.length ===
          this.formData.access.filter((x) => x.view).length,
        indeterminate: this.formData.access.some((x) => x.view),
        changeAll: (check: boolean) => {
          this.accessDataSource = new MatTableDataSource(
            this.accessDataSource.data.map((x) => {
              x.view = check;
              if(!check) {
                x.modify = check;
                x.rights = [];
              }
              return x as Access;
            })
          );
          this.accessGridChange();
        },
      },
      modify: {
        all:
          this.formData.access.length ===
          this.formData.access.filter((x) => x.modify).length,
        indeterminate: this.formData.access.some((x) => x.modify),
        changeAll: (check: boolean) => {
          this.accessDataSource = new MatTableDataSource(
            this.accessDataSource.data.map((x) => {
              x.modify = !check ? false : check && x.view ? true : false;
              return x as Access;
            })
          );
          this.accessGridChange();
        },
      },
    };
  }

  ngOnInit(): void {
    for (var item of this.appconfig.config.lookup.access) {
      this.accessDataSource.data.push({
        page: item.page,
        view: item.view,
        modify: false,
        rights: [],
      } as Access);
    }
    this.initDetails();
  }

  async initDetails() {
    if (this.isNew) {
      this.adminAccessForm = this.formBuilder.group(
        {
          firstName: [
            '',
            [Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')],
          ],
          lastName: [
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
          ],
          userName: [null],
          password: [
            '',
            [
              Validators.minLength(6),
              Validators.maxLength(16),
              Validators.required,
            ],
          ],
          confirmPassword: '',
          access: [this.accessDataSource.data as Access[]],
        },
        { validators: this.checkPasswords }
      );
      this.adminAccessForm.controls["mobileNumber"].valueChanges.subscribe(res=> {
        this.adminAccessForm.controls["userName"].setValue(res)
      })
    } else {
      this.adminAccessForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        mobileNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern('^[0-9]*$'),
          ],
        ],
        userName: [],
        access: [[] as Access[]],
      });
      const res = await this.userService.getAdminById(this.id).toPromise();
      if (res.success) {
        this.f['firstName'].setValue(res.data.firstName);
        this.f['lastName'].setValue(res.data.lastName);
        this.f['mobileNumber'].setValue(res.data.mobileNumber);
        this.f['userName'].setValue(res.data.user.userName);
        this.f['access'].setValue(res.data.user.access);

        for (var access of this.accessDataSource.data) {
          const findAccess = res.data.user.access.find(x=>x.page.toLowerCase() === access.page.toLowerCase());
          if(findAccess) {
            access.view = findAccess.view;
            access.modify = findAccess.modify;
            access.rights = findAccess.rights;
          } else {
            access.rights = [];
          }
        }
        this.f['userName'].disable();
        if (this.isReadOnly) {
          this.adminAccessForm.disable();
        }
      } else {
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
      }
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

  accessGridChange() {
    this.f['access'].setValue(this.accessDataSource.data);
  }

  rightsOptions(page: string) {
    const access = (this.appconfig.config.lookup.access as Access[]).find(
      (x) => x.page.toUpperCase() === page.toUpperCase()
    );
    return access && access.rights ? access.rights : [];
  }

  onSubmit() {
    if (this.adminAccessForm.invalid) {
      return;
    }

    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save user?';
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
        let res: ApiResponse<Admin>;
        if (this.isNew) {
          res = await this.userService.createAdmin(params).toPromise();
        } else {
          res = await this.userService.updateAdmin(this.id, params).toPromise();
        }

        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/admin/admin-access/' + res.data.adminCode]);
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
