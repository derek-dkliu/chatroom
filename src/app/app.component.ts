import { Component } from '@angular/core';
import { RoomService } from './chat/shared/services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chitchat';

  constructor(public roomService: RoomService) { }
}
