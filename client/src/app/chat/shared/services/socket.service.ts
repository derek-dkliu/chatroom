import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

import { Message } from '../models/message.model';
import { Event } from '../models/event';
import { Room } from 'src/app/rooms/shared/models/room';

const SERVER_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() {
    this.initSocket();
  }

  public isConnected(): boolean {
    return this.socket && this.socket.connected;
  }

  public initSocket(): void {
    if (!this.isConnected()) {
      this.socket = socketIo(SERVER_URL);
    }
  }

  public removeAllListeners(): void {
    this.socket.removeAllListeners();
  }

  public requestRoomlist(): void {
    this.socket.emit('roomlist', {});
  }

  public create(room: Room): void {
    this.socket.emit('create', room);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
        this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onRoomList(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('roomlist', (data: any) => observer.next(data));
    });
  }

  public onRoomHistory(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('roomhistory', (data: any) => observer.next(data));
    });
  }

  public onCreate(): Observable<Room> {
    return new Observable<Room>(observer => {
        this.socket.on('create', (data: Room) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
        this.socket.on(event, () => observer.next());
    });
  }
}
