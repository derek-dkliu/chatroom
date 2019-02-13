import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export enum DialogUserType {
  NEW,
  EDIT
}

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  previousUsername: string;

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) {
    this.previousUsername = params.username ? params.username : undefined;
  }

  ngOnInit() {
  }

  public onSave(): void {
    if (!this.params.username) {
      return;
    }

    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });
  }

}
