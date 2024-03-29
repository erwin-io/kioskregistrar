import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes }   from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material/material.module';
import { CommonModule } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AdminComponent } from './pages/admin/admin.component';
import { MemberComponent } from './pages/member/member.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AppConfigService } from './services/app-config.service';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CustomHttpInterceptor } from './interceptors/custom-http.interceptors';
import { OptionSheetComponent } from './shared/option-sheet/option-sheet.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter } from './shared/utility/app-date-adapter';
import { QrCodeScannerModule } from './shared/qr-code-scanner/qr-code-scanner.module';
import { QrCodeGeneratorModule } from './shared/qr-code-generator/qr-code-generator.module';
import { SelectAdminDialogComponent } from './shared/select-admin-dialog/select-admin-dialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { ImageUploadDialogComponent } from './shared/image-upload-dialog/image-upload-dialog.component';
import { ImageViewerDialogComponent } from './shared/image-viewer-dialog/image-viewer-dialog.component';
import { PusherService } from './services/pusher.service';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MemberComponent,
    ProfileComponent,
    AuthComponent,
    AlertDialogComponent,
    PageNotFoundComponent,
    OptionSheetComponent,
    NoAccessComponent,
    SelectAdminDialogComponent,
    ImageUploadDialogComponent,
    ImageViewerDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ImageCropperModule,
    WebcamModule,
    NgHttpLoaderModule.forRoot(),
    QrCodeScannerModule,
    QrCodeGeneratorModule
  ],
  providers: [
    PusherService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500} },
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [AppConfigService],
      useFactory : (config : AppConfigService) =>  () => config.loadAppConfig()
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {provide: DateAdapter, useClass: AppDateAdapter},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
