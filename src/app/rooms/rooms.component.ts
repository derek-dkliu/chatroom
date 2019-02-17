import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../chat/shared/models/event';
import { Room } from './shared/models/room';
import { MatDialog } from '@angular/material';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { SocketService } from '../chat/shared/services/socket.service';
import { UserService } from '../chat/shared/services/user.service';
import { RoomService } from '../chat/shared/services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public roomService: RoomService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    // Using timeout due to https://github.com/angular/angular/issues/14748
    if (!this.userService.hasName()) {
      setTimeout(() => {
        this.openUserDialog({
          disableClose: true,
          data: {
            title: 'Welcome'
          }
        });
      }, 0);
    }

    this.initIoConnection();
  }

  ngOnDestroy() {
    this.socketService.removeAllListeners();
  }

  private initIoConnection(): void {

    this.socketService.requestRoomlist();

    this.socketService.onRoomList()
      .subscribe((rooms) => {
        this.roomService.initRooms(rooms);
      });

    this.socketService.onCreate()
      .subscribe((room: Room) => {
        this.roomService.add(room);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  add() {
    this.openRoomDialog({
      data: { name: '' }
    });
  }

  private openRoomDialog(params): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, params);
    dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      const room = new Room(null, paramsDialog.name,  paramsDialog.token);
      this.socketService.create(room);
    });
  }

  public onClickUserInfo() {
    this.openUserDialog({
      data: {
        title: 'Edit Profile'
      }
    });
  }

  private openUserDialog(params): void {
    this.dialog.open(UserDialogComponent, params);
  }
}
