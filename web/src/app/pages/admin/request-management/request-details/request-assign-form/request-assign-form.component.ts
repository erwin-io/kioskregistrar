import { Component, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-request-assign-form',
  templateUrl: './request-assign-form.component.html',
  styleUrls: ['./request-assign-form.component.scss']
})
export class RequestAssignFormComponent {
  isLoading = false;
  list: {id: string, fullName: string}[];
  error;
  conFirm = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RequestAssignFormComponent>) {
      this.isLoading = true;
      dialogRef.disableClose = true;
      this.onInitAdminList();
    }

    onInitAdminList() {
      try{
        this.isLoading = true;
        this.userService.getAllAdmin().subscribe(async res => {
            if(res.success){
              this.list = res.data.map(x=> {
                return {
                  id: x.adminId,
                  fullName: x.fullName,
                }

              })
              this.isLoading = false;
            } else {
              this.isLoading = false;
              this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
            }
        })
      }
      catch(e){
        this.isLoading = false;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      }
    }

    onDismiss() {
      this.dialog.closeAll();
    }

    onSelect({ id, fullName}) {
      const dialogData = new AlertDialogModel();
      dialogData.title = 'Confirm';
      dialogData.message = `Assign to ${fullName}?`;
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

      dialogRef.componentInstance.conFirm.subscribe(async (res: boolean) => {
        if(res) {
          this.conFirm.emit({ id, fullName});
          dialogRef.close();
        }
      });
    }
}
