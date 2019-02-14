import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RoomRoutingModule } from './room-routing.module';
import { RoomsComponent } from './rooms.component';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoomRoutingModule,
  ],
  declarations: [
    RoomsComponent,
    RoomDialogComponent,
    UserDialogComponent
  ],
  entryComponents: [RoomDialogComponent, UserDialogComponent]
})
export class RoomsModule { }
