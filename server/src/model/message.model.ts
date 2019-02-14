import { User } from "./user.model";

export class Message {
  constructor(
    private from: User, 
    private content: string,
    public action: number,
    public roomId: string) {}
}
