import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { generateSchoolYear } from 'src/app/shared/utility/utility';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  admin = false;
  loading = false;
  submitted = false;
  error: string;
  isProcessing = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private storageService: StorageService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    private router: Router) {
      // redirect to home if already logged in

      const profile = this.storageService.getLoginProfile();
      if (profile) {
          this.storageService.saveLoginProfile(null);
      }
    }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      mobileNumber: ['', [ Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^[0-9]*$'), Validators.required]],
      email: ['', [ Validators.email, Validators.required]],
      userName: ['',[ Validators.required]],
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

  onSubmit() {
    if (this.registerForm.invalid) {
        return;
    }
    try{
      const params = this.registerForm.value;
      this.spinner.show();
      this.authService.register(params)
        .subscribe(async res => {
          if (res.success) {
            this.spinner.hide();
            this.snackBar.open(res.message, 'close', {panelClass: ['style-success']});
            this.router.navigate(['/auth/']);
          } else {
            this.spinner.hide();
            this.error = Array.isArray(res.message) ? res.message[0] : res.message;
            this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          }
        }, async (res) => {
          this.spinner.hide();
          this.error = res.error.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        });
    } catch (e){
      this.spinner.hide();
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }
  }

  get f() {
    return this.registerForm.controls;
  }
  get formIsValid() {
    return this.registerForm.valid;
  }
  get formData() {
    return this.registerForm.value;
  }

  get yearList() {
    return generateSchoolYear(1950, false);
  }

  get pairedYearList() {
    return generateSchoolYear(1950, true);
  }

  getError(key: string) {
    if (key === 'confirmPassword') {
      this.formData.confirmPassword !== this.formData.password
        ? this.f[key].setErrors({ notMatched: true })
        : this.f[key].setErrors(null);
    }
    if(!this.f[key]) {
      console.log(key)
    }
    return this.f[key].errors;
  }
}
