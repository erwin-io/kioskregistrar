import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Courses } from 'src/app/model/courses.model';
import { CoursesService } from 'src/app/services/courses.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  host: {
    class: "page-component"
  }
})
export class CoursesComponent {
  displayedColumns = ['courseName', 'controls'];
  dataSource = new MatTableDataSource<Courses>();
  id;
  isProcessing = false;
  isNew = false;
  courseForm: FormGroup;
  error;
  @ViewChild('courseFormDialog') courseFormDialogTemp: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,) {
    this.courseForm = this.formBuilder.group({
      courseName: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      }
    );
  }

  ngOnInit(): void {
    this.initCourses();
  }

  initCourses() {
    this.coursesService.getAll().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.data);
    })
  }

  onShowNewCourse() {
    this.isNew = true;
    this.dialog.open(this.courseFormDialogTemp, {
      disableClose: true,
      panelClass: 'course-dialog',
      width: '720px'
    });
  }

  async editCourse(id) {
    this.isNew = false;
    this.isProcessing = true;
    const res = await this.coursesService.getById(id).toPromise();
    if(res.data) {
      this.id = id;
      this.dialog.open(this.courseFormDialogTemp, {
        disableClose: true,
        panelClass: 'course-dialog',
        width: '720px'
      });
      this.courseForm.controls["courseName"].setValue(res.data.courseName);
    }
    this.isProcessing = false;
  }

  deleteCourse(id) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete course?';
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
        let res = await this.coursesService.delete(id).toPromise();
        if (res.success) {
          this.snackBar.open('Course deleted!', 'close', {
            panelClass: ['style-success'],
          });
          this.initCourses();
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
        const formData = this.courseForm.value;
        if(this.isNew) {
          res = await this.coursesService.create(formData).toPromise();
        } else {
          res = await this.coursesService.update(this.id, formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.initCourses();
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
    return this.courseForm.controls && this.courseForm.controls[key] ? this.courseForm.controls[key].errors : null;
  }
}
