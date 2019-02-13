import { Component, OnInit, ElementRef, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { MatList, MatListItem, MatDialog } from '@angular/material';

import { Action } from './shared/models/action';
import { Event } from './shared/models/event';
import { User } from './shared/models/user.model';
import { Message } from './shared/models/message.model';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent, DialogUserType } from './dialog-user/dialog-user.component';


const AVATAR_URL = 'https://api.adorable.io/avatars/200';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(
    private socketService: SocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initUser();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openUserPopup({
        disableClose: true,
        data: {
          title: 'Welcome',
          dialogType: DialogUserType.NEW
        }
      });
    }, 0);
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private initUser(): void {
    const randomId = this.getRandomId();
    this.user = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }

  private openUserPopup(params): void {
    const dialogRef = this.dialog.open(DialogUserComponent, params);
    dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        if (paramsDialog.username !== paramsDialog.previousUsername) {
          this.sendNotification(paramsDialog, Action.RENAME);
        }
      }
    });
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
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
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      };
    } else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }

    this.socketService.send(message);
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }
}
