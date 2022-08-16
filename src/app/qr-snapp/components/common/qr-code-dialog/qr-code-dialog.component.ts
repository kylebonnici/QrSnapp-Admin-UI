import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.css']
})
export class QrCodeDialogComponent implements OnInit {

  title: string;
  qrCodeString: string;

  constructor(private dialogRef: MatDialogRef<QrCodeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.qrCodeString = this.data.qrCodeString;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
