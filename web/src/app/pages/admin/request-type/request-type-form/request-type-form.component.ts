import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestType } from 'src/app/model/request-type';

@Component({
  selector: 'app-request-type-form',
  templateUrl: './request-type-form.component.html',
  styleUrls: ['./request-type-form.component.scss']
})
export class RequestTypeFormComponent {

  requestTypeForm: FormGroup;
  @Input() isReadOnly: any;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.requestTypeForm = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      authorizeACopy: [false,[Validators.required]],
      fee: ['',
        [
          Validators.minLength(1),
          Validators.maxLength(6),
          Validators.pattern('^[0-9]*$'),
          Validators.required,
        ],
      ],
      isPaymentRequired: [false,[Validators.required]]});
  }

  public setFormValue(value: RequestType) {
    if(this.requestTypeForm) {
      this.requestTypeForm.controls["name"].setValue(value.name);
      this.requestTypeForm.controls["authorizeACopy"].setValue(value.authorizeACopy);
      this.requestTypeForm.controls["fee"].setValue(value.fee);
      this.requestTypeForm.controls["isPaymentRequired"].setValue(value.isPaymentRequired);
    }
  }

  public get getFormData() {
    return this.requestTypeForm.value;
  }

  public get valid() {
    return this.requestTypeForm.valid;
  }

  public get ready() {
    return this.requestTypeForm.valid && this.requestTypeForm.dirty;
  }

  getError(key: string) {
    return this.requestTypeForm.controls && this.requestTypeForm.controls[key] ? this.requestTypeForm.controls[key].errors : null;
  }
}
