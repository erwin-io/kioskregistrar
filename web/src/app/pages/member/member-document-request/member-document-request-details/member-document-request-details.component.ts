import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Subscription } from 'rxjs';
import { Access } from 'src/app/model/access';
import { Request } from 'src/app/model/request';
import { RequestService } from 'src/app/services/request.service';
import { QrCodeGeneratorComponent } from 'src/app/shared/qr-code-generator/qr-code-generator.component';
import { Location } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-member-document-request-details',
  templateUrl: './member-document-request-details.component.html',
  styleUrls: ['./member-document-request-details.component.scss'],
  host: {
    class: "dialog-component"
  },
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class MemberDocumentRequestDetailsComponent implements OnInit, AfterViewInit {

  isLoading = false;
  error;
  requestNo: any = 0;
  requestDetails: Request;

  statusTrackerOrientation: 'vertical' | 'horizontal' = 'vertical'

  mediaWatcher: Subscription;

  pageAccess: Access = {
    view: true,
    modify: false,
  };

  descriptionCtrl = new FormControl(null, [Validators.required])

  descriptionChanged = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private _location: Location,
    private spinner: SpinnerVisibilityService,
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    public media: MediaObserver,
    private route: ActivatedRoute) {

    }
  ngAfterViewInit() {
    this.descriptionCtrl.setValue(this.requestDetails.description);
  }
  ngOnInit() {
  }


  openQRCodeGeneratorDialog() {
    const dialogRef = this.dialog.open(QrCodeGeneratorComponent, {
      width: '780px',
      panelClass: 'qr-generator-dialog',
    });
    dialogRef.componentInstance.qrData = this.requestDetails.requestNo;
  }

  onDismiss() {
    this.dialog.closeAll();
  }

  async onUpdateDescription() {
    try {
      this.spinner.show();
      const res = await this.requestService.updateDescription(this.requestDetails.requestNo, {description: this.descriptionCtrl.value}).toPromise();
      if(res.success) {
        this.requestDetails.description = res.data.description;
        this.descriptionChanged.emit(this.descriptionCtrl.value);
        this.snackBar.open('Description updated!', 'close', {
          panelClass: ['style-success'],
        });
        this.spinner.hide();
        this.descriptionCtrl.markAsUntouched();
        this.descriptionCtrl.markAsPristine();
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

  profilePicErrorHandler(event) {
    event.target.src = '../../../../../assets/img/person.png';
  }
}
