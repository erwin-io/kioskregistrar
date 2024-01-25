import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from 'src/app/model/admin';
import { Member } from 'src/app/model/member';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { generateSchoolYear } from 'src/app/shared/utility/utility';

@Component({
  selector: 'app-edit-member-form',
  templateUrl: './edit-member-form.component.html',
  styleUrls: ['./edit-member-form.component.scss']
})
export class EditMemberFormComponent {
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

    this.form = this.formBuilder.group({
        firstName: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
        lastName: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
        mobileNumber: ['', [ Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$'), Validators.required]],
        email: ['', [ Validators.email, Validators.required]],
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

  get yearList() {
    return generateSchoolYear(1950, false);
  }

  get pairedYearList() {
    return generateSchoolYear(1950, true);
  }

  getError(key: string) {
    return this.f[key].errors;
  }

  init(value: Member) {
    this.form.setValue({
      firstName: value.firstName,
      lastName: value.lastName,
      mobileNumber: value.mobileNumber,
      email: value.email,
      birthDate: value.birthDate,
      gender: value.gender,
      address: value.address,
      courseTaken: value.courseTaken,
      major: value.major,
      isAlumni: value.isAlumni,
      schoolYearLastAttended: value.schoolYearLastAttended,
      primarySchoolName: value.primarySchoolName,
      primarySyGraduated: value.primarySyGraduated,
      secondarySchoolName: value.secondarySchoolName,
      secondarySyGraduated: value.secondarySyGraduated,
    });
    this.form.markAsPristine();
  }

  async onSubmit() {
    this.submit.emit(this.formData);
  }
}
