import { Component, OnInit, ElementRef, QueryList, ViewChild, ViewChildren, AfterViewInit, OnDestroy } from '@angular/core';
import { MatList, MatListItem, MatDialog } from '@angular/material';
import {Location} from '@angular/common';

import { Action } from './shared/models/action';
import { Event } from './shared/models/event';
import { Message } from './shared/models/message.model';
import { SocketService } from './shared/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './shared/services/user.service';
import { User } from './shared/models/user.model';
import { TokenDialogComponent } from './token-dialog/token-dialog.component';
import { RoomService } from './shared/services/room.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  action = Action;
  user: User;
  validToken: boolean;
  roomId: string;
  messageContent: string;
  ioConnection: any;

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(
    private userService: UserService,
    public roomService: RoomService,
    private socketService: SocketService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.roomId = this.route.snapshot.paramMap.get('id');
    const room = this.roomService.getRoom(+this.roomId);
    if (room !== undefined) {
      if (room.hasToken()) {
        setTimeout(() => {
          this.openTokenDialog();
        }, 0);
      } else {
        this.initIoConnection();
      }

      this.validToken = true;
      this.roomService.setTitle(room.name);
    } else {
      this.goback();
      console.log('invalid room');
    }
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    this.roomService.setTitle(null);
    if (this.validToken) {
      this.roomService.cleanMessages();
      this.sendNotification(Action.LEFT);
    }
    this.socketService.removeAllListeners();
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initIoConnection(): void {
    this.sendNotification(Action.JOINED);

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.roomService.addMessage(message);
      });

    this.socketService.onRoomHistory()
      .subscribe((history) => {
        this.roomService.initMessages(history);
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

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message,
      roomId: this.roomId
    });
    this.messageContent = null;
  }

  public sendNotification(action: Action): void {
    let message: Message;

    if (action === Action.JOINED || action === Action.LEFT) {
      message = {
        from: this.user,
        action: action,
        roomId: this.roomId,
      };
    }

    this.socketService.send(message);
  }

  private openTokenDialog(): void {
    const dialogRef = this.dialog.open(TokenDialogComponent, {
      disableClose: true,
      data: {
        roomId: this.roomId
      }
    });

    dialogRef.afterClosed().subscribe(paramsDialog => {
      this.validToken = paramsDialog.valid;
      if (this.validToken) {
        this.initIoConnection();
      } else {
        this.goback();
      }
    });
  }

  goback() {
    this.location.back();
  }
}
