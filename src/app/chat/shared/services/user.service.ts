import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

// const AVATAR_URL = 'https://api.adorable.io/avatars/200';
const AVATAR_URL = 'https://ui-avatars.com/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;

  constructor() {
    const id = this.randomId();
    // const avatar = `${AVATAR_URL}/${id}.png`;
    this.user = { id, avatar: null, name: null };
  }

  public hasName(): boolean {
    return this.user.name !== null;
  }

  public setName(name: string) {
    this.user.name = name;
    this.user.avatar = `${AVATAR_URL}?name=${name}&background=${this.getRandomColor()}`;
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

  private getRandomColor(): string {
    const letters = '9ABCDE'.split('');
    let color = '';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }
}
