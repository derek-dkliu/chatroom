import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RoomService } from '../shared/services/room.service';

@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrls: ['./token-dialog.component.css']
})
export class TokenDialogComponent implements OnInit {
  tokenFormControl = new FormControl('', [Validators.required]);

  constructor(
    private roomService: RoomService,
    public dialogRef: MatDialogRef<TokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) {}

  ngOnInit() {
  }

  onSubmit(): void {
    if (!this.params.token) {
      return;
    }

    const valid = this.roomService.validate(+this.params.roomId, this.params.token);

    this.dialogRef.close({
      valid
    });
  }

}
