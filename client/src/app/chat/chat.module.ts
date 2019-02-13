import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './chat.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ChatComponent, DialogUserComponent],
  entryComponents: [DialogUserComponent]
})
export class ChatModule { }
