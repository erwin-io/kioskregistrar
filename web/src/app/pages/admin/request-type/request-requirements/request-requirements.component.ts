import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestRequirements } from 'src/app/model/request-requirements';
import { RequestType } from 'src/app/model/request-type';
import { RequestRequirementsService } from 'src/app/services/request-requirements.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-request-requirements',
  templateUrl: './request-requirements.component.html',
  styleUrls: ['./request-requirements.component.scss']
})
export class RequestRequirementsComponent {
  id;
  isProcessing = false;
  requirementForm: FormGroup;
  isNew = false;
  displayedColumns = ['name', 'requireToSubmitProof', 'controls'];
  dataSource = new MatTableDataSource<RequestRequirements>();
  @Input() requestType: RequestType;
  @Input() isReadOnly: any;
  @ViewChild('requirementFormDialog') requirementFormDialogTemp: TemplateRef<any>;
  error;
  constructor(
    private requestRequirementsService: RequestRequirementsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,) {
    this.requirementForm = this.formBuilder.group({
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      requireToSubmitProof: [false,[Validators.required]]});
  }


  ngAfterViewInit() {
  }

  initRequirements(data: RequestRequirements[]) {
    if(data) {
      this.dataSource = new MatTableDataSource(data);
    }
  }

  onShowNewRequirment() {
    this.isNew = true;
    this.dialog.open(this.requirementFormDialogTemp, {
      disableClose: true
    });
  }

  async editRequirement(id) {
    this.isNew = false;
    this.isProcessing = true;
    const res = await this.requestRequirementsService.getById(id).toPromise();
    if(res.data) {
      this.id = id;
      this.dialog.open(this.requirementFormDialogTemp, {
        disableClose: true
      });
      this.requirementForm.controls["name"].setValue(res.data.name);
      this.requirementForm.controls["requireToSubmitProof"].setValue(res.data.requireToSubmitProof);
    }
    this.isProcessing = false;
  }

  deleteRequirement(id) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete requirement?';
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
        let res = await this.requestRequirementsService.delete(id).toPromise();
        if (res.success) {
          this.snackBar.open('Requirement deleted!', 'close', {
            panelClass: ['style-success'],
          });
          let requirements = await this.requestRequirementsService.get(this.requestType.requestTypeId).toPromise();
          this.initRequirements(requirements.data);
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

  onSubmit() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update request type?';
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
        let res;
        const formData = this.requirementForm.value;
        if(this.isNew) {
          formData.requestTypeId = this.requestType.requestTypeId;
          res = await this.requestRequirementsService.create(formData).toPromise();
        } else {
          res = await this.requestRequirementsService.update(this.id, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          // this.router.navigate(['/admin/request-type/' + res.data.requestTypeId + '/edit'], { replaceUrl: true});
          let requirements = await this.requestRequirementsService.get(this.requestType.requestTypeId).toPromise();
          this.initRequirements(requirements.data);
          this.requirementForm.setValue(
            { name: null, requireToSubmitProof: false }
          );
          this.requirementForm.markAsUntouched();
          this.requirementForm.markAsPristine();
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
          this.dialog.closeAll();
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

  getError(key: string) {
    return this.requirementForm.controls && this.requirementForm.controls[key] ? this.requirementForm.controls[key].errors : null;
  }

}
