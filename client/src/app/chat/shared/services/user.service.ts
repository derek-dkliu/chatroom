import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

const AVATAR_URL = 'https://api.adorable.io/avatars/200';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;

  constructor() {
    const id = this.randomId();
    const avatar = `${AVATAR_URL}/${id}.png`;
    this.user = { id, avatar, name: null };
  }

  public hasName(): boolean {
    return this.user.name !== null;
  }

  public setName(name: string) {
    this.user.name = name;
  }

  public getUser(): User {
    return this.user;
  }

  public getName(): string {
    return this.user.name;
  }

  private randomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }
}
