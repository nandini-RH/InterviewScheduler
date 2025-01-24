import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-custom-dialog',
  template: `
    <div class="dialog-container">
      <h1 mat-dialog-title>{{ data.title }}</h1>
      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>
      <div mat-dialog-actions>

        <button mat-raised-button color="primary" (click)="onClose()" style="font-size: 18px; padding: 16px 32px;">
         OK
        </button>

      </div>
    </div>

  `,
  styles: [
    `
      .dialog-container {
        text-align: center;
        color: #333;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
      }

      button {
        margin-top: 20px;
        background-color: #a9cbed;
        color: white;
        border-color: black;
        margin-bottom: 20px;
        border-radius: 15px;

      }

      button:hover {
        background-color: #fdffff;
        color: black;
        border-color: #020101;
      }
    `,
  ],
})
export class CustomDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
