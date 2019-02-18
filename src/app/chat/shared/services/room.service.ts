import { Injectable } from '@angular/core';
import { Room } from '../../../rooms/shared/models/room';
import { Message } from '../models/message.model';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private title: string;
  private rooms: Room[];
  private messages: Message[];

  constructor() {
    this.rooms = [];
    this.messages = [];
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(room: Room) {
    if (room !== null) {
      let mode = '';
      if (room.hasToken()) {
        mode = 'private';
      } else {
        mode = 'public';
      }
      this.title = `${room.name} (${mode})`;
    }
  }

  public isEmpty(): boolean {
    return this.rooms.length === 0;
  }

  public initRooms(rooms: Room[]): void {
    this.rooms = rooms.map(room => new Room(room.id, room.name, room.token));
  }

  public initMessages(messages: Message[]): void {
    this.messages = messages;
  }

  public cleanMessages(): void {
    this.messages = [];
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
  }

  public add(room: Room): void {
    this.rooms.push(new Room(room.id, room.name, room.token));
  }

  public remove(room: Room): void {
    this.rooms = this.rooms.filter(r => r.id !== room.id);
  }

  public validate(roomId: number, token: string): boolean {
    const room = this.getRoom(roomId);
    return room !== undefined && room.validate(token);
  }

  public getRoom(roomId: number): Room {
    return this.rooms.find(room => room.id === roomId);
  }

  public getRooms(): Room[] {
    return this.rooms;
  }

  public getMessages(): Message[] {
    return this.messages;
  }
}
