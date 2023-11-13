import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Request  } from 'src/app/model/request';
import { RequestService } from 'src/app/services/request.service';
import { RequestAssignFormComponent } from '../request-assign-form/request-assign-form.component';
import { CONST_REQUEST_STATUS_ENUM } from 'src/app/constant/date';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-status-tracker',
  templateUrl: './status-tracker.component.html',
  styleUrls: ['./status-tracker.component.scss']
})
export class StatusTrackerComponent {
  @Input() requestDetails: Request;
  @Input() pageRights: any;
  @Output() statusUpdated = new EventEmitter();
  error;
  constructor(
    private spinner: SpinnerVisibilityService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private requestService: RequestService) {
    console.log(this.requestDetails);
    console.log(this.pageRights);
  }

  ngAfterViewInit() {
    console.log(this.requestDetails);
    console.log(this.pageRights);
  }

  onCloseRequest() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = `Close request?`;
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

    dialogRef.componentInstance.conFirm.subscribe(async (conFirmed: boolean) => {
      if(conFirmed) {
        try {
          this.spinner.show();
          const res = await this.requestService.closeRequest(this.requestDetails.requestNo, {}).toPromise();
          if(res.success) {
            this.requestDetails = res.data;
            this.statusUpdated.emit(res.data);
            dialogRef.close();
            this.snackBar.open('Request closed!', 'close', {
              panelClass: ['style-success'],
            });
            this.spinner.hide();
          } else {
            this.error = res.message;
            this.snackBar.open(this.error, 'close', {
              panelClass: ['style-error'],
            });
            this.spinner.hide();
          }
        } catch(ex) {
          this.error = ex.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.spinner.hide();
        }
      }
    });
  }

  onRequestCompleted() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = `Complete request now?`;
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

    dialogRef.componentInstance.conFirm.subscribe(async (conFirmed: boolean) => {
      if(conFirmed) {
        try {
          this.spinner.show();
          const res = await this.requestService.completeRequest(this.requestDetails.requestNo, {}).toPromise();
          if(res.success) {
            this.requestDetails = res.data;
            this.statusUpdated.emit(res.data);
            dialogRef.close();
            this.snackBar.open('Request completed!', 'close', {
              panelClass: ['style-success'],
            });
            this.spinner.hide();
          } else {
            this.error = res.message;
            this.snackBar.open(this.error, 'close', {
              panelClass: ['style-error'],
            });
            this.spinner.hide();
          }
        } catch(ex) {
          this.error = ex.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.spinner.hide();
        }
      }
    });
  }

  onMarkAsToComplete() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = `Compelete process and mark as to complete?`;
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

    dialogRef.componentInstance.conFirm.subscribe(async (conFirmed: boolean) => {
      if(conFirmed) {
        try {
          this.spinner.show();
          const res = await this.requestService.markAsToComplete(this.requestDetails.requestNo, {}).toPromise();
          if(res.success) {
            this.requestDetails = res.data;
            this.statusUpdated.emit(res.data);
            dialogRef.close();
            this.snackBar.open('Request completed!', 'close', {
              panelClass: ['style-success'],
            });
            this.spinner.hide();
          } else {
            this.error = res.message;
            this.snackBar.open(this.error, 'close', {
              panelClass: ['style-error'],
            });
            this.spinner.hide();
          }
        } catch(ex) {
          this.error = ex.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.spinner.hide();
        }
      }
    });
  }

  onPayNow() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = `Pay request?`;
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

    dialogRef.componentInstance.conFirm.subscribe(async (conFirmed: boolean) => {
      if(conFirmed) {
        try {
          this.spinner.show();
          const res = await this.requestService.payRequest(this.requestDetails.requestNo, {}).toPromise();
          if(res.success) {
            this.requestDetails = res.data;
            this.statusUpdated.emit(res.data);
            dialogRef.close();
            this.snackBar.open('Request paid!', 'close', {
              panelClass: ['style-success'],
            });
            this.spinner.hide();
          } else {
            this.error = res.message;
            this.snackBar.open(this.error, 'close', {
              panelClass: ['style-error'],
            });
            this.spinner.hide();
          }
        } catch(ex) {
          this.error = ex.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.spinner.hide();
        }
      }
    });
  }

  onAssignNow() {
    const dialogRef = this.dialog.open(RequestAssignFormComponent, {
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.conFirm.subscribe(async ({ id, fullName }) => {
      try {
        if({ id, fullName }){
          this.spinner.show();
          const res = await this.requestService.assignRequest(this.requestDetails.requestNo, {
            assignedAdminId: id
          }).toPromise();
          if(res.success) {
            this.requestDetails = res.data;
            this.statusUpdated.emit(res.data);
            dialogRef.close();
            this.snackBar.open('Request assigned!', 'close', {
              panelClass: ['style-success'],
            });
            this.spinner.hide();
          } else {
            this.error = res.message;
            this.snackBar.open(this.error, 'close', {
              panelClass: ['style-error'],
            });
            this.spinner.hide();
          }
        }
      }catch(ex) {
        this.error = ex.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        this.spinner.hide();
      }
    });
  }
}
