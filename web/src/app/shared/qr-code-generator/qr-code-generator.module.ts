import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeGeneratorComponent } from './qr-code-generator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';
import { NgxQrcodeStylingModule } from 'ngx-qrcode-styling';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxQrcodeStylingModule
  ],
  declarations: [QrCodeGeneratorComponent]
})
export class QrCodeGeneratorModule { }
