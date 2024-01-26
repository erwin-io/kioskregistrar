import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Request } from 'src/app/model/request'
import { ImageViewerDialogComponent } from 'src/app/shared/image-viewer-dialog/image-viewer-dialog.component';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent {
  @Input() requestDetails: Request = {} as any;
  userProfilePicLoaded = false;
  constructor(
    private dialog: MatDialog) {
  }

  onShowImageViewer() {
    const dialogRef = this.dialog.open(ImageViewerDialogComponent, {
        disableClose: true,
        panelClass: "image-viewer-dialog"
    });
    dialogRef.componentInstance.imageSource = this.requestDetails?.requestedBy?.user?.profileFile?.url;
    dialogRef.componentInstance.canChange = false;
  }

  profilePicErrorHandler(event) {
    event.target.src = this.getDeafaultProfilePicture();
  }

  getDeafaultProfilePicture() {
    if(this.requestDetails && this.requestDetails?.requestedBy?.gender?.toUpperCase() === "FEMALE") {
      return '../../../../../../assets/img/person-female.png';
    } else {
      return '../../../../../../assets/img/person.png';
    }
  }
}
