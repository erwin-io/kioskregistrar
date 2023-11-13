import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss']
})
export class QrCodeScannerComponent {

  scannerData = {
    canRetry: false,
    data: "",
    message: "",
    error: ""
  }
  scanComplete = new EventEmitter();
  scanError = new EventEmitter();
  constructor() {}

  onScanSuccess(event) {
    console.log(event);
    this.scannerData.data = event;
    this.scannerData.error = null;
    this.scannerData.canRetry = true;
    this.scanComplete.emit(event);
  }
  onScanError(event) {
    console.log(event);
    this.scannerData.error = event;
    this.scannerData.data = null;
    this.scannerData.canRetry = true;
    this.scanError.emit(event);
  }
}
