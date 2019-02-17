export class Room {
  id?: number;
  name?: string;
  token?: string;

  constructor(id: number, name: string, token: string) {
    this.id = id === null ? this.randomId() : id;
    this.name = name;
    this.token = token;
  }

  public hasToken(): boolean {
    return this.token !== undefined && this.token !== null && this.token !== '';
  }

  public validate(token: string): boolean {
    return this.token === token;
  }

  private randomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }
}

