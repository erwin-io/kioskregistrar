import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Access } from 'src/app/model/access';
import { Admin } from 'src/app/model/admin';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-admin-form',
  templateUrl: './edit-admin-form.component.html',
  styleUrls: ['./edit-admin-form.component.scss']
})
export class EditAdminFormComponent {
  form: FormGroup;
  isNew = false;
  isReadOnly = true;
  @Output() submit = new EventEmitter<any>();
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
        ]
      },
    );
  }


  get f() {
    return this.form.controls;
  }
  get formIsValid() {
    return this.form.valid;
  }
  get formData() {
    return this.form.value;
  }

  getError(key: string) {
    return this.f[key].errors;
  }

  init(value: Admin) {
    this.form.setValue({
      firstName: value.firstName,
      lastName: value.lastName,
      mobileNumber: value.mobileNumber,
    });
    this.form.markAsPristine();
  }

  async onSubmit() {
    this.submit.emit(this.formData);
  }
}
