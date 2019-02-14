import { User } from './user.model';
import { Action } from './action';

export class Message {
  from?: User;
  content?: any;
  action?: Action;
  roomId?: string;
}
