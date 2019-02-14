import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css']
})
export class RoomDialogComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) {}

  ngOnInit() {
  }

  onSave(): void {
    if (!this.params.name) {
      return;
    }

    this.dialogRef.close({
      name: this.params.name,
      token: this.params.token
    });
  }

}
