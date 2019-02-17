import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { TokenDialogComponent } from './token-dialog/token-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule,
  ],
  declarations: [ChatComponent, TokenDialogComponent],
  entryComponents: [TokenDialogComponent]
})
export class ChatModule { }
