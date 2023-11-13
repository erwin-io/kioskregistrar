import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { Request } from 'src/app/model/request';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, Validators } from '@angular/forms';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Access } from 'src/app/model/access';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeScannerComponent } from 'src/app/shared/qr-code-scanner/qr-code-scanner.component';
import { QrCodeGeneratorComponent } from 'src/app/shared/qr-code-generator/qr-code-generator.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
  host: {
    class: 'page-component',
  },
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class RequestDetailsComponent {
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
  constructor(
    private dialog: MatDialog,
    private _location: Location,
    private spinner: SpinnerVisibilityService,
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    public media: MediaObserver,
    private route: ActivatedRoute) {
      this.requestNo = this.route.snapshot.paramMap.get('requestNo');
      this.initDetails();
      if (this.route.snapshot.data) {
        this.pageAccess = {
          ...this.pageAccess,
          ...this.route.snapshot.data['access'],
        };
      }
      this.mediaWatcher = this.media.asObservable().subscribe((change) => {
        change.forEach((item) => {
          console.log(this.media.isActive(["gt-sm", "lt-sm", "gt-xm", "lt-xm", "sm", "xm"]))
          this.handleMediaChange(item);
        });
      })
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  get qrData() {
    return `${window.location.host}${window.location.pathname}`;
  }


  private handleMediaChange(mediaChange: MediaChange) {
    if (this.media.isActive('gt-sm')) {
      this.statusTrackerOrientation = 'vertical';
    } else {
      this.statusTrackerOrientation = 'horizontal';
    }
  }

  ngOnInit() {
  }

  initDetails() {
    this.isLoading = true;
    this.spinner.show();
    this.requestService.getById(this.requestNo).subscribe(res=> {
      console.log(res);
      if (res.success) {
        this.requestDetails = res.data;
      } else {
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
      }
      this.isLoading = false;
      this.spinner.hide();
    });
  }

  openQRCodeGeneratorDialog() {
    const dialogRef = this.dialog.open(QrCodeGeneratorComponent, {
      width: '780px',
      panelClass: 'qr-generator-dialog',
    });
    dialogRef.componentInstance.qrData = this.requestNo;
  }

  openSacannerDialog() {
    const dialogRef = this.dialog.open(QrCodeScannerComponent, {
      width: '780px',
      panelClass: 'scanner-dialog'
    });
    dialogRef.componentInstance.scanComplete.subscribe(res=> {
      console.log(res);
      const requestNo = res;
      console.log(requestNo);
      this.spinner.show();
      this.isLoading = true;
      try {
        this.requestService.getById(requestNo).subscribe(res=> {
          console.log(res);
          if (res.success) {
            this.requestNo = requestNo;
            this.requestDetails = res.data;
            this._location.go("/admin/request-management/details/" + requestNo);
            dialogRef.close();
          } else {
            dialogRef.componentInstance.scannerData.message = "Invalid QR Code or QR Code was not a request number.";
            this.snackBar.open("Invalid QR Code or QR Code was not a request number.", 'close', {
              panelClass: ['style-error'],
            });
          }
          this.isLoading = false;
          this.spinner.hide();
        }, ()=> {
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open("Invalid QR Code or QR Code was not a request number.", 'close', {
            panelClass: ['style-error'],
          });
          this.isLoading = false;
          this.spinner.hide();
          dialogRef.componentInstance.scannerData.message = "Invalid QR Code or QR Code was not a request number.";
        });
      } catch(ex) {
        this.isLoading = false;
        this.spinner.hide();
        dialogRef.componentInstance.scannerData.message = "Error scanning, please try again";
      }
    })
  }
}
