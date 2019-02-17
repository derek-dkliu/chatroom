import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/chat/shared/services/user.service';


@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any
  ) {
    this.params.username = this.userService.getName();
  }

  ngOnInit() {
  }

  public onSave(): void {
    if (!this.params.username) {
      return;
    }

    this.userService.setName(this.params.username);

    this.dialogRef.close({
      username: this.params.username,
    });
  }

}
