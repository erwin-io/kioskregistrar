import { Component, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Member } from 'src/app/model/member';
import { RequestType } from 'src/app/model/request-type';
import { RequestTypeService } from 'src/app/services/request-type.service';
import { RequestService } from 'src/app/services/request.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-new-member-document-request',
  templateUrl: './new-member-document-request.component.html',
  styleUrls: ['./new-member-document-request.component.scss']
})
export class NewMemberDocumentRequestComponent {
  requestType: RequestType;
  requestForm: FormGroup;
  isLoading = false;
  isProcessing = false;
  error;
  currentUser: Member;


  requestTypePageIndex = 0;
  requestTypePageSize = 10;
  requestTypeTotal = 0;
  requestTypeOrder: any = { requestTypeId: "DESC" };


  requestTypeList: RequestType[] = [];
  @ViewChild('selectRequestTypeDialog') selectRequestTypeDialogTemp: TemplateRef<any>;
  requestTypeDialog: MatDialogRef<any, any> ;
  newRequestAdded = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private requestTypeService: RequestTypeService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinner: SpinnerVisibilityService,
    public dialogRef: MatDialogRef<NewMemberDocumentRequestComponent>) {
      const currentUser = this.storageService.getLoginProfile();
      this.currentUser = currentUser as Member;
      this.requestForm = this.formBuilder.group(
        {
          requestedById: new FormControl(this.currentUser.memberId),
          requestTypeId: new FormControl(null, Validators.required),
          description: new FormControl(null, [Validators.required]),
        }
      );
  }


  get f() {
    return this.requestForm.controls;
  }
  get formIsValid() {
    return this.requestForm.valid;
  }
  get formIsReady() {
    return this.requestForm.valid && this.requestForm.dirty;
  }
  get formData() {
    return this.requestForm.value;
  }

  getError(key: string) {
    return this.f[key].errors;
  }

  async onSubmit() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Are you sure you want to submit the request?';
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
        const params = this.formData;
        let res = await this.requestService.create(params).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.dialog.closeAll();
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
          this.newRequestAdded.emit(res.data);
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

  onShowSelectRequestTypeDialog() {
    this.requestTypeDialog = this.dialog.open(this.selectRequestTypeDialogTemp, {
      width: '400px',
      panelClass: 'select-request-type'
    });
    this.requestTypeDialog.componentInstance = {
      requestType: null,
    }
    this.requestType = null;
    this.getRequestType();
  }

  onCloseSelectRequestTypeDialog() {
    this.requestTypeDialog.close();
  }

  onConfirmSelectRequestTypeDialog() {
    this.requestTypeDialog.close();
    this.requestType = this.requestTypeDialog.componentInstance?.requestType;
    this.requestForm.controls["requestTypeId"].setValue(this.requestType.requestTypeId);
  }

  async getRequestType(searchKey: string = "", refresh = true){
    try{
      this.isLoading = true;
      this.spinner.show();
      await this.requestTypeService.getByAdvanceSearch({
        order: this.requestTypeOrder,
        columnDef: [{
          apiNotation: "name",
          filter: searchKey ? searchKey : ""
        }],
        pageIndex: this.requestTypePageIndex,
        pageSize: this.requestTypePageSize
      })
      .subscribe(async res => {
        if(res.success){
          if(refresh) {
            this.requestTypeList = res.data.results;
          } else {
            this.requestTypeList = [...this.requestTypeList, ...res.data.results];
          }
          this.requestTypeTotal = res.data.total;
          this.isLoading = false;
          this.spinner.hide();
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
          this.spinner.hide();
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
        this.spinner.hide();
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
      this.spinner.hide();
    }

  }
}
