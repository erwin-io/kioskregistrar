import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeScannerComponent } from './qr-code-scanner.component';
import { QuarModule } from '@altack/quar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    QrCodeScannerComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    QuarModule
  ]
})
export class QrCodeScannerModule { }
